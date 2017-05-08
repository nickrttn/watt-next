require('dotenv').config()
const express = require('express')
const app = require('express')()
const port = 1337

const MongoClient = require("mongodb").MongoClient
const MONGODB_URI = process.env.MONGODB_URI
console.log(MONGODB_URI)

MongoClient.connect(MONGODB_URI, (err, database) => {
	if (err) return console.log(err)
	db = database
})


app
	.listen(process.env.PORT || port, () => {
		console.log('api server on http://localhost:' + port)
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

app.get('/api/v1/grid/:id', (req, res) => {

})

app.get('/api/v1/generator/:id', (req, res) => {

})

app.get('/api/v1/stand/:stand', (req, res) => {
	const standCollection = db.collection('stands')
	const stand = req.params.stand


	standCollection.findOne({
		name: stand
	}, function(err, stand) {
		if (err) return console.log(err)
			res.json(JSON.stringify(stand))

	})
})

const generate = () => {
	setInterval(function() {
		const generatorCollection = db.collection('generators')
		const standCollection = db.collection('stands')

		standCollection.find({}, {}).toArray(function(err, stands) {
			stands.map(function(stand) {
				generateMessage(stand)
			})

		})
	}, 3000)
}

// generate()

const initGenerator = (generator) => {
	const generatorCollection = db.collection('generators')
	const data = {
		name: generator,
		created_at: Date.now()
	}

	generatorCollection.save(data, (err, result) => {
		if (err) return console.log(err)
	})
}

const initStand = (generator, stand) => {
	const generatorCollection = db.collection('generators')
	const standCollection = db.collection('stands')

	generatorCollection.findOne({
		name: generator
	}, function(err, generator) {
		if (err) return console.log(err)
		const data = {
			name: stand,
			generator: generator._id,
			created_at: Date.now()
		}

		standCollection.save(data, (err, result) => {
			if (err) return console.log(err)
			console.info('Created stand called `' + data.name + '` that is connected to generator `' + generator.name + '`')
		})
	})

}

const generateMessage = (stand) => {
	const generatorCollection = db.collection('generators')
	const messageCollection = db.collection('messages')

	const data = {
		stand: stand._id,
		generator: stand.generator,
		timestamp: Date.now(),
		avr_va: randomNumnodem(90500, 90600),
		min_va: randomNumnodem(86500, 86700),
		max_va: randomNumnodem(95400, 95600),
	}

	messageCollection.save(data, (err, result) => {
		if (err) return console.log(err)
		console.info('Create message for stand `' + stand.name + '` that is connected to generator `' + stand.generator + '`')
	})
}

const randomNumnodem = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min
}