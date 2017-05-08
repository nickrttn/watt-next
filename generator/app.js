require('dotenv').config();
const express = require('express')
const app = require('express')()
const port = 1337

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI)

MongoClient.connect(MONGODB_URI, (err, database) => {
	if (err) return console.log(err)
	db = database
});


app
	.get('/', (req, res) => {


	})
	.listen(process.env.PORT || port, () => {
		console.log('api server on http://localhost:' + port)
	})

app.get('/init/generator/:generator', (req, res) => {
	const generator = req.params.generator
	initGenerator(generator)
});

app.get('/init/generator/:generator/stand/:stand', (req, res) => {
	const generator = req.params.generator
	const stand = req.params.stand
	initStand(generator, stand)
});

app.get('/grid/:id', (req, res) => {

});

app.get('/generator/:id', (req, res) => {

});

const generate = () => {
	setInterval(function() {
		const generatorCollection = db.collection('generators');

		generatorCollection.find({}, {}).toArray(function(err, generators) {
			generators.map(function(generator) {
				generateMessage(generator)
			});

		});
	}, 1000);
}

// generate()


const initGenerator = (generator) => {
	const generatorCollection = db.collection('generators');
	const data = {
		name: generator,
		created_at: Date.now()
	}

	generatorCollection.save(data, (err, result) => {
		if (err) return console.log(err);
	});
}

const initStand = (generator, stand) => {
	const generatorCollection = db.collection('generators');
	const standCollection = db.collection('stands');

	generatorCollection.findOne({
		name: generator
	}, function(err, generator) {
		if (err) return console.log(err);
		const data = {
			name: stand,
			generator: generator._id,
			created_at: Date.now()
		}

		standCollection.save(data, (err, result) => {
			if (err) return console.log(err);
			console.info('created stand called `' + data.name + '` that is connected to generator `' + generator.name + '`')
		});
	})

}

const generateMessage = (generator) => {
	const generatorCollection = db.collection('generators');
	const messageCollection = db.collection('messages');

	const data = {
		generatorId: generator._id,
		timestamp: Date.now(),
		avr_va: randomNumnodem(90500, 90600),
		min_va: randomNumnodem(86500, 86700),
		max_va: randomNumnodem(95400, 95600),
	}

	console.log(data)
	messageCollection.save(data, (err, result) => {
		if (err) return console.log(err);
	});
}

const randomNumnodem = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
}