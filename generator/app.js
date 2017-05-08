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
			console.log(generators)
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
		avr_va: 90555,
		min_va: 86865,
		max_va: 95323.28
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
		avr_va: 90555 + 10,
		min_va: 86865 + 10,
		max_va: 95323.28 + 10
	}
	messageCollection.save(data, (err, result) => {
		if (err) return console.log(err);
	});
}