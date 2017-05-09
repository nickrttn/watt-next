/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const request = require('request');
const moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
	const io = req.app.locals.settings.io;

	io.on('connection', function(socket) {
		console.log('connected ' + socket.id)
		setInterval(() => {
			getData(io)
		}, 1000);
	})

	res.render('index', {
		title: 'Watt-Next'
	});
});

const getData = (io) => {
	const url = 'http://localhost:1337/api/v1/stand/craftbeers/messages?q=1'
	request(url, function(err, response, body) {
		let data = JSON.parse(body);

		data.messages[0].time = moment(data.messages[0].timestamp).format('h:mm:ss a'); ;
		console.log(data.messages[0].timestamp)
		io.emit('updated data', data)
	})
}

module.exports = router;