require('dotenv').config()
const express = require('express')
const app = require('express')()
const bodyParser = require('body-parser')
const port = 1337

const MongoClient = require("mongodb").MongoClient
const MONGODB_URI = process.env.MONGODB_URI
const collections = {}

MongoClient.connect(MONGODB_URI, (err, database) => {
	if (err) return console.log(err)
	db = database
	collections.generators = db.collection('generators')
	collections.stands = db.collection('stands')
	collections.messages = db.collection('messages')
	collections.settings = db.collection('settings')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

app
	.set('view engine', 'pug')
	.use(express.static('public'))
	.listen(process.env.PORT || port, () => {
		console.log('api server on http://localhost:' + port)
	})

app.get('/api/v1/settings', (req, res) => {
	collections.settings.findOne({}, function(err, setting) {
		res.render('components/settings', {
			setting
		})
	})
})

app.post('/api/v1/settings', (req, res) => {
	const multiplier = req.body.multiplier

	const data = {
		multiplier: multiplier
	}

	collections.settings.findOne({}, function(err, setting) {
		if (setting == null) {
			collections.settings.save(data, (err, result) => {
				if (err) return console.log(err)
			})
		} else {
			collections.settings.updateOne(setting, {
				$set: data
			}, (error, result) => {
				if (err) return console.log(err)
			})

		}
		res.redirect('/api/v1/settings')
	})
})

app.get('/api/v1/reset', (req, res) => {
	const updateData = {
		multiplier: 0,
		created_at: Date.now()
	}

	collections.settings.findOne({}, function(err, setting) {
		collections.settings.updateOne(setting, {
			$set: updateData
		}, (error, result) => {
			if (err) return console.log(err)
			console.info('Settings reset!')
			res.redirect('/api/v1/settings')
		})
	})

})

app.get('/api/v1/init/generator/:generator', (req, res) => {
	const generator = req.params.generator
	initGenerator(generator)
})

app.get('/api/v1/init/generator/:generator/stand/:stand', (req, res) => {
	const generator = req.params.generator
	const stand = req.params.stand
	initStand(generator, stand)
})

app.get('/api/v1/generator/:generator', (req, res) => {
	const generator = req.params.generator

	collections.generators.findOne({
		name: generator
	}, (err, generator) => {
		if (err) return console.log(err)
		collections.stands.find({
			"generator": generator._id
		}, {}).toArray(function(err, stands) {
			const response = {}
			response.generatorId = generator._id
			response.generatorName = generator.name
			response.stands = stands
			response.timestamp = Date.now()

			res.json(JSON.stringify(response))
		})
	})
})

app.get('/api/v1/stand/:stand', (req, res) => {
	const stand = req.params.stand

	collections.stands.findOne({
		name: stand
	}, (err, stand) => {
		if (err) return console.log(err)
		res.json(JSON.stringify(stand))
	})
})

app.get('/api/v1/stand/:stand/messages', (req, res) => {
	const stand = req.params.stand

	collections.stands.findOne({
		name: stand
	}, (err, stand) => {
		if (err) return console.log(err)
		collections.messages.find({
			"stand": stand._id
		}, {}).toArray(function(err, messages) {
			const response = {}
			response.generatorId = messages[0].generator
			response.standId = stand._id
			response.standName = stand.name
			response.messages = messages
			response.timestamp = Date.now()

			res.json(JSON.stringify(response))
		})
	})
})

app.get('/api/v1/generator/:generator/messages', (req, res) => {
	const generator = req.params.generator

	collections.generators.findOne({
		name: generator
	}, (err, generator) => {
		if (err) return console.log(err)
		collections.messages.find({
			"generator": generator._id
		}, {}).toArray(function(err, messages) {
			const response = {}
			response.generatorId = generator._id
			response.standName = generator.name
			response.messages = messages
			response.timestamp = Date.now()

			res.json(JSON.stringify(response))
		})
	})
})

const generate = () => {
	setInterval(function() {

		collections.stands.find({}, {}).toArray(function(err, stands) {
			stands.map(function(stand) {
				generateMessage(stand)
			})
		})
	}, 3000)
}

// generate()

const initGenerator = (generator) => {
	const data = {
		name: generator,
		created_at: Date.now()
	}

	collections.generators.save(data, (err, result) => {
		if (err) return console.log(err)
		console.info('Created generator called `' + data.name + '`')

	})
}

const initStand = (generator, stand) => {

	collections.generators.findOne({
		name: generator
	}, (err, generator) => {
		if (err) return console.log(err)
		const data = {
			name: stand,
			generator: generator._id,
			created_at: Date.now()
		}

		collections.stands.save(data, (err, result) => {
			if (err) return console.log(err)
			console.info('Created stand called `' + data.name + '` that is connected to generator `' + generator.name + '`')
		})
	})

}

const generateMessage = (stand) => {

	const data = {
		stand: stand._id,
		generator: stand.generator,
		timestamp: Date.now(),
		avr_va: randomNum(90500, 90600),
		min_va: randomNum(86500, 86700),
		max_va: randomNum(95400, 95600),
	}

	collections.messages.save(data, (err, result) => {
		if (err) return console.log(err)
		console.info('Create message for stand `' + stand.name + '` that is connected to generator `' + stand.generator + '`')
	})
}

const randomNum = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min
}