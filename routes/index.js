/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const request = require('request');
const moment = require('moment');

const BASEURL = 'http://localhost:1337';

const clients = []

/* GET home page. */
router.get('/', function(req, res, next) {
	const io = req.app.locals.settings.io;

	io.on('connection', function(socket) {
		if (clients.filter(client => client.socketId == socket.id).length > 0) {
			return
		}

		const client = {
			socketId: socket.id,
			request: '/api/v1/stand/craftbeers/messages?q=1'
		}
		clients.push(client)

		console.info('Client (' + socket.id + ') connected!')
		console.info('Total of connected clients: ' + clients.length)

		socket.on('disconnect', function() {
			// remove client from array of know clients
			let i = clients.indexOf(socket);
			clients.splice(i, 1);

			// showing what's going on
			console.info('Client (' + socket.id + ') disconnected!')
			console.info('Total of connected clients: ' + clients.length)
		});

		clients.forEach((client) => {
			getData(io, client)
		})

		setInterval(function() {
			clients.forEach((client) => {
				getData(io, client)
			})
		}, 1000);

		socket.on('request', function(url) {
			clients.map((client) => {
				if (client.socketId == socket.id) {
					client.request = url
				}
			})
		})
	})

	res.render('index', {
		title: 'Watt-Next'
	});
});

const getData = (io, client) => {
	const url = BASEURL + client.request
	console.log(url)
	request(url, function(err, response, body) {
		let data = JSON.parse(body);

		data.messages[0].time = moment(data.messages[0].timestamp).format('h:mm:ss a');;
		io.emit('updated data', data)
		io.to(client.socketId).emit('updated data', data);
	})
}



module.exports = router;