
/*jshint esversion: 6 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const index = require('./routes/index');

const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)
const PORT = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("io", io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

/* START SERVER
======================================== */
http.listen(PORT, function() {
	console.log('listening on http://localhost:' + PORT);
});

