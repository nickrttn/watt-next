/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const request = require('request');
const moment = require('moment');

module.exports = (io) => {
	/* GET home page. */
	router.get('/', function(req, res, next) {
		// io.on('connection', function(socket) {
		// 	console.log('connected ' + socket.id)
		// 	setInterval(() => {
		// 		getData(io)
		// 	}, 1000);
		// })

		res.render('index', {
			title: 'Watt-Next'
		});
	});

	const getData = (io) => {
		const url = 'http://localhost:1337/api/v1/stand/craftbeers/messages'
		request(url, (err, response, body) => {
			let data = JSON.parse(body);
			data.messages = data.messages.slice(data.messages.length - 6, data.messages.length - 1);
			data.messages[4].time = moment(	data.messages[4].timestamp).startOf('hour').fromNow();
			io.emit('updated data', data)
		});
	}

	return router;
};
