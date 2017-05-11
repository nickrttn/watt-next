const express = require('express');
const request = require('request');
const moment = require('moment');

const router = new express.Router();

const clients = [];

const getData = (io, client) => {
  const url = process.env.API_ENDPOINT + client.request;
  console.log(url);
  request(url, (err, response, body) => {
    if (err) {
      return console.error(err);
    }

    const data = JSON.parse(body);

    data.messages[0].time = moment(data.messages[0].timestamp).format('h:mm:ss a');
    io.emit('updated data', data);
    io.to(client.socketId).emit('updated data', data);
  });
};

module.exports = io => {
  /* GET home page. */
  router.get('/', (req, res) => {
    io.on('connection', socket => {
      if (clients.filter(client => client.socketId === socket.id).length > 0) {
        return;
      }

      const client = {
        socketId: socket.id,
        request: '/api/v1/stand/craftbeers/messages?q=1'
      };

      clients.push(client);

      console.info('Client (' + socket.id + ') connected!');
      console.info('Total of connected clients: ' + clients.length);

      socket.on('disconnect', () => {
        const i = clients.indexOf(socket);
        clients.splice(i, 1);

        console.info('Client (' + socket.id + ') disconnected!');
        console.info('Total of connected clients: ' + clients.length);
      });

      clients.forEach(client => {
        getData(io, client);
      });

      setInterval(() => {
        clients.forEach(client => {
          getData(io, client);
        });
      }, 1000);

      socket.on('request', url => {
        clients.map(client => {
          if (client.socketId === socket.id) {
            client.request = url;
          }
          return true;
        });
      });
    });

    res.render('index', {
      title: 'Watt-Next'
    });
  });

  return router;
};
