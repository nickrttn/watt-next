const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const server = new http.Server(app); // eslint-disable-line import/order
const io = require('socket.io')(server);

const index = require('./routes/index')(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(path.join(__dirname, 'assets/build')));

app.use('/', index);

module.exports = app;

/* START SERVER
======================================== */
server.listen(process.env.PORT, () => {
	console.log('listening on http://localhost:' + process.env.PORT);
});

