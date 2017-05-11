require('dotenv').config();
const express = require('express');
const app = require('express')();
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

const energyLabels = {
	A: {min: 0, avg: 200, max: 400},
	B: {min: 400, avg: 1400, max: 2400},
	C: {min: 2400, avg: 4200, max: 6000},
	D: {min: 6000, avg: 10000, max: 14000},
	E: {min: 14000, avg: 17000, max: 20000}
};

let databaseURI;
if (process.env.NODE_ENV === 'production') {
	databaseURI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}`;	
} else {
	databaseURI = process.env.MONGODB_URI;
}

const collections = {}

MongoClient.connect(MONGODB_URI, (err, db) => {
	if (err) return console.log(err);
	collections.generators = db.collection('generators');
	collections.stands = db.collection('stands');
	collections.devices = db.collection('devices');
	collections.messages = db.collection('messages');
	collections.settings = db.collection('settings');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}));

app
	.set('view engine', 'pug')
	.use(express.static('public'))
	.listen(process.env.PORT, () => {
		console.log('api server on http://localhost:' + process.env.PORT)
	});

app.get('/api/v1/settings', (req, res) => {
	collections.settings.findOne({}, function(err, setting) {
		res.render('components/settings', {
			setting
		});
	});
});

app.post('/api/v1/settings', (req, res) => {
	const multiplier = req.body.multiplier

	const data = {multiplier};

	collections.settings.findOne({}, (err, setting) => {
		if (setting === null) {
			collections.settings.save(data, (err, result) => {
				if (err) return console.log(err);
			});
		} else {
			collections.settings.updateOne(setting, {
				$set: data
			}, (error, result) => {
				if (err) return console.log(err);
			});
		}
		res.redirect('/api/v1/settings');
	});
});

app.get('/api/v1/reset', (req, res) => {
	const updateData = {
		multiplier: 0,
		created_at: Date.now()
	};

	collections.settings.findOne({}, (err, setting) => {
		collections.settings.updateOne(setting, {
			$set: updateData
		}, (error, result) => {
			if (err) return console.log(err);
			console.info('Settings reset!');
			res.redirect('/api/v1/settings');
		});
	});
});

app.get('/api/v1/init/generator/:generator', (req, res) => {
	const generator = req.params.generator;
	initGenerator(generator);
	res.send('success');
	res.end();
});

app.get('/api/v1/init/generator/:generator/stand/:stand', (req, res) => {
	const generator = req.params.generator;
	const stand = req.params.stand;
	initStand(generator, stand);
	res.send('success');
	res.end();
});

app.get('/api/v1/init/stand/:stand/device/:device/label/:label', (req, res) => {
	const stand = req.params.stand;
	const device = req.params.device;
	const energyLabel = req.params.label;
	initDevice(stand, device, energyLabel, false);
	res.send('success');
	res.end();
});

app.get('/api/v1/init/stand/:stand/real-device/:device/label/:label', (req, res) => {
	const stand = req.params.stand;
	const device = req.params.device;
	const energyLabel = req.params.label;
	initDevice(stand, device, energyLabel, true);
	res.send('success');
	res.end();
});

app.get('/api/v1/generator/:generator', (req, res) => {
	const generator = req.params.generator;

	collections.generators.findOne({
		name: generator
	}, (err, generator) => {
		if (err) return console.log(err);
		collections.stands.find({
			"generator": generator._id
		}, {}).toArray((err, stands) => {
			const response = {};
			response.generatorId = generator._id;
			response.generatorName = generator.name;
			response.stands = stands;
			response.timestamp = Date.now();

			res.json(response);
		});
	});
});

app.get('/api/v1/stand/:stand', (req, res) => {
	const stand = req.params.stand

	collections.stands.findOne({
		name: stand
	}, (err, stand) => {
		if (err) return console.log(err)
		res.json(stand)
	})
})

app.get('/api/v1/device/:device/total', (req, res) => {
	const device = req.params.device

	collections.messages.find({
		"device": device,
		"type": 'device'
	}, {}).toArray(function(err, messages) {
		const data = {
			device: device,
			total: 0
		}
		messages.forEach((message) => {
			data.total+= message.avr_watt
		})
		res.json(data)
	})
})

app.get('/api/v1/device/:device/messages', (req, res) => {
	const device = req.params.device;
	let quantity = parseInt(req.query.q);

	// check if quantity is given, otherwise return all messages
	if (quantity == NaN) {
		quantity = '';
	}

	collections.devices.findOne({
		name: device
	}, (err, device) => {
		if (err) return console.log(err)
		collections.messages.find({
			"device": device.name,
			"type": 'device'
		}, {}).limit(quantity).sort({
			$natural: -1
		}).toArray(function(err, messages) {
			const response = {}
			response.generatorId = messages[0].generator
			response.deviceId = device._id
			response.deviceName = device.name
			response.messages = messages
			response.timestamp = Date.now()

			res.json(response);
		});
	});
});

app.get('/api/v1/stand/:stand/messages', (req, res) => {
	const stand = req.params.stand
	let quantity = parseInt(req.query.q)

	// check if quantity is given, otherwise return all messages
	if (quantity == NaN) {
		quantity = ''
	}

	collections.stands.findOne({
		name: stand
	}, (err, stand) => {
		if (err) return console.log(err);

		collections.messages.find({
			stand: stand.name,
			type: 'stand'
		}, {}).limit(quantity).sort({
			$natural: -1
		}).toArray((err, messages) => {
			const response = {}
			response.generatorId = messages[0].generator;
			response.standName = stand.name;
			response.devices = stand.devices;
			response.messages = messages;
			response.timestamp = Date.now();
			response.currentUsage = kw(messages[0].usage);

			res.json(response);
		});
	});
});

app.get('/api/v1/real-device/:device/watt/:watt', (req, res) => {
	collections.devices.findOne(req.params.device, (err, device) => {
		const deviceData = {
			type: 'device',
			device: device.name,
			stand: device.stand,
			timestamp: Date.now(),
			usage: req.query.watt
		};

		const standData = {
			type: 'stand',
			stand: device.stand,
			timestamp: Date.now(),
			usage: deviceData.avr_watt,
		};

		collections.messages.save(deviceData, (err, result) => {
			if (err) return console.log(err);
		});

		collections.messages.save(standData, (err, result) => {
			if (err) return console.log(err);
		});
	});
});

app.get('/api/v1/stand/:stand/total', (req, res) => {
	const stand = req.params.stand

	collections.messages.find({
		"stand": stand,
		"type": 'stand'
	}, {}).toArray(function(err, messages) {
		const data = {
			stand: stand,
			total: 0
		}
		messages.forEach((message) => {
			data.total+= message.avr_watt
		})
		res.json(data);
	})
})

app.get('/api/v1/generator/:generator/messages', (req, res) => {
	const generator = req.params.generator;
	let quantity = parseInt(req.query.q);

	// check if quantity is given, otherwise return all messages
	if (quantity == NaN) {
		quantity = ''
	}

	collections.generators.findOne({
		name: generator
	}, (err, generator) => {
		if (err) return console.log(err);
		collections.messages.find({
			"generator": generator._id
		}, {}).limit(quantity).sort({
			$natural: -1
		}).toArray((err, messages) => {
			const response = {};
			response.generatorId = generator._id;
			response.standName = generator.name;
			response.messages = messages;
			response.timestamp = Date.now();

			res.json(response);
		});
	});
});

const generate = () => {
	setInterval(() => {
		generateMessages();
	}, 1000);
};

const initGenerator = generator => {
	const data = {
		name: generator,
		created_at: Date.now()
	};

	collections.generators.save(data, (err, result) => {
		if (err) return console.log(err);
		console.info('Created generator called `' + data.name + '`')
	});
};

const initStand = (generator, stand) => {
	collections.generators.findOne({
		name: generator
	}, (err, generator) => {
		if (err) return console.log(err);
		const data = {
			name: stand,
			generator: generator._id,
			devices: [],
			created_at: Date.now()
		};

		collections.stands.save(data, (err, result) => {
			if (err) return console.log(err);
			console.info('Created stand called `' + data.name + '` that is connected to generator `' + generator.name + '`')
		});
	});
};

const initDevice = (stand, device, energyLabel, real) => {
	collections.stands.findOne({
		name: stand
	}, (err, stand) => {
		if (err) return console.log(err);
		const data = {
			name: device,
			real,
			energyLabel,
			stand: stand._id,
			created_at: Date.now()
		};

		collections.devices.save(data, (err, result) => {
			if (err) return console.log(err);
			console.info('Created device called `' + data.name + '` that is connected to stand `' + stand.name + '`')
		});

		const updateData = {};

		if (stand.devices === undefined) {
			updateData.devices = [data];
		} else {
			const devicesArr = stand.devices;
			devicesArr.push(data);
			updateData.devices = devicesArr;
		}

		collections.stands.findOne({
			_id: stand._id
		}, (err, stand) => {
			collections.stands.updateOne(stand, {
				$set: updateData
			}, (error, result) => {
				if (err) return console.log(err);
			});
		});
	});
};

const generateMessages = () => {
	console.log("generating");

	collections.stands.find({}, {}).toArray((err, stands) => {
		stands.forEach((stand) => {
			let multiplier = 1;
			let business = 0;
			collections.settings.findOne({}, (err, setting) => {
				if (err) return console.log(err);

				const standData = {
					type: 'stand',
					stand: stand.name,
					timestamp: Date.now(),
					usage: 0,
				};

				stand.devices.forEach((device) => {
					if (device.real) {
						return;
					}

					if (setting.multiplier < 0) {
						business = randomNum(
							energyLabels[device.energyLabel].min,
							energyLabels[device.energyLabel].avg
						) * setting.multiplier;
					} else if (setting.multiplier > 0) {
						business = randomNum(
							energyLabels[device.energyLabel].avg,
							energyLabels[device.energyLabel].max
						) * setting.multiplier;
					}

					const deviceData = {
						type: 'device',
						device: device.name,
						stand: device.stand,
						timestamp: Date.now(),
						// Moet afhankelijk worden van energielabel
						usage: energyLabels[device.energyLabel].avg + business,
					};

					standData.usage += deviceData.usage;

					collections.messages.save(deviceData, (err, result) => {
						if (err) return console.log(err);
					});
				});

				collections.messages.save(standData, (err, result) => {
					if (err) return console.log(err);
				});
			});
		});
	});
};

const randomNum = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
};

const kw = watt => watt / 1000;
const kwh = (kw, h) => kw * h;

const totalUsage = messages => {
	return kwh(kw(messages.reduce((acc, msg) => {
		acc += msg.usage;
		return acc;
	}, 0)) / messages.length,
	(messages[messages.length - 1].timestamp -
		messages[0].timestamp) / 3600);
};

const avgUsage = messages => {
	return kw(messages.reduce((acc, msg) => {
		acc += msg.usage;
		return acc;
	}, 0)) / messages.length;
};

generate()
