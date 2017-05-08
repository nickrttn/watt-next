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

app.get('/init/:name', (req, res) => {
	const name = req.params.name
	initGenerator(name)
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
				updateGenerator(generator)
			});

		});
	}, 1000);
}

generate()


const initGenerator = (name) => {
	const generatorCollection = db.collection('generators');
	const data = {
		name: name,
		timestamp: Date.now(),
	}

	generatorCollection.save(data, (err, result) => {
		if (err) return console.log(err);
	});
}

const updateGenerator = (generator) => {
	const generatorCollection = db.collection('generators');
	const messageCollection = db.collection('messages');

	const data = {
		generatorId: generator._id,
		timestamp: Date.now(),
		avr_va: randomNum(90500,90600),
		min_va: randomNum(86500,86700),
		max_va: randomNum(95400,95600),
	}

	console.log(data)
	messageCollection.save(data, (err, result) => {
		if (err) return console.log(err);
	});
}

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}