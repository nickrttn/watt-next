require('dotenv').config()
const express = require('express')
const app = require('express')()
const bodyParser = require('body-parser')

const MongoClient = require("mongodb").MongoClient
const MONGODB_URI = process.env.MONGODB_URI
const collections = {}

MongoClient.connect(MONGODB_URI, (err, database) => {
  if (err) return console.log(err)
  db = database
  collections.generators = db.collection('generators')
  collections.stands = db.collection('stands')
  collections.devices = db.collection('devices')
  collections.messages = db.collection('messages')
  collections.settings = db.collection('settings')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app
  .set('view engine', 'pug')
  .use(express.static('public'))
  .listen(process.env.PORT || port, () => {
    console.log('api server on http://localhost:' + port)
  })

app.get('/api/v1/settings', (req, res) => {
  collections.settings.findOne({}, function(err, setting) {
    res.render('components/settings', {
      setting
    })
  })
})

app.post('/api/v1/settings', (req, res) => {
  const multiplier = req.body.multiplier

  const data = {
    multiplier: multiplier
  }

  collections.settings.findOne({}, function(err, setting) {
    if (setting == null) {
      collections.settings.save(data, (err, result) => {
        if (err) return console.log(err)
      })
    } else {
      collections.settings.updateOne(setting, {
        $set: data
      }, (error, result) => {
        if (err) return console.log(err)
      })

    }
    res.redirect('/api/v1/settings')
  })
})

app.get('/api/v1/reset', (req, res) => {
  const updateData = {
    multiplier: 0,
    created_at: Date.now()
  }

  collections.settings.findOne({}, function(err, setting) {
    collections.settings.updateOne(setting, {
      $set: updateData
    }, (error, result) => {
      if (err) return console.log(err)
      console.info('Settings reset!')
      res.redirect('/api/v1/settings')
    })
  })

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

app.get('/api/v1/init/stand/:stand/device/:device', (req, res) => {
  const stand = req.params.stand
  const device = req.params.device
  initDevice(stand, device)
})

app.get('/api/v1/generator/:generator', (req, res) => {
  const generator = req.params.generator

  collections.generators.findOne({
    name: generator
  }, (err, generator) => {
    if (err) return console.log(err)
    collections.stands.find({
      "generator": generator._id
    }, {}).toArray(function(err, stands) {
      const response = {}
      response.generatorId = generator._id
      response.generatorName = generator.name
      response.stands = stands
      response.timestamp = Date.now()

      res.json(response)
    })
  })
})

app.get('/api/v1/stand/:stand', (req, res) => {
  const stand = req.params.stand

  collections.stands.findOne({
    name: stand
  }, (err, stand) => {
    if (err) return console.log(err)
    res.json(stand)
  })
})

app.get('/api/v1/device/:device/total', (req, res) => {
  const device = req.params.device

  collections.messages.find({
    "device": device,
    "type": 'device'
  }, {}).toArray(function(err, messages) {
    const data = {
      device: device,
      total: 0
    }
    messages.forEach((message) => {
      data.total+= message.avr_watt
    })
    res.json(data)
  })
})

app.get('/api/v1/device/:device/messages', (req, res) => {
  const device = req.params.device
  let quantity = parseInt(req.query.q)

  // check if quantity is given, otherwise return all messages
  if (quantity == NaN) {
    quantity = ''
  }

  collections.devices.findOne({
    name: device
  }, (err, device) => {
    if (err) return console.log(err)
    collections.messages.find({
      "device": device.name,
      "type": 'device'
    }, {}).limit(quantity).sort({
      $natural: -1
    }).toArray(function(err, messages) {
      const response = {}
      response.generatorId = messages[0].generator
      response.deviceId = device._id
      response.deviceName = device.name
      response.messages = messages
      response.timestamp = Date.now()

      res.json(response)
    })
  })
})

app.get('/api/v1/stand/:stand/messages', (req, res) => {
  const stand = req.params.stand
  let quantity = parseInt(req.query.q)

  // check if quantity is given, otherwise return all messages
  if (quantity == NaN) {
    quantity = ''
  }

  collections.stands.findOne({
    name: stand
  }, (err, stand) => {
    if (err) return console.log(err)
    collections.messages.find({
      "stand": stand.name,
      "type": 'stand'
    }, {}).limit(quantity).sort({
      $natural: -1
    }).toArray(function(err, messages) {

      console.log(messages)
      const response = {}
      response.generatorId = messages[0].generator
      response.standId = stand._id
      response.standName = stand.name,
        response.devices = stand.devices
      response.messages = messages
      response.timestamp = Date.now()

      res.json(response)
    })
  })
})

app.get('/api/v1/stand/:stand/total', (req, res) => {
  const stand = req.params.stand

  collections.messages.find({
    "stand": stand,
    "type": 'stand'
  }, {}).toArray(function(err, messages) {
    const data = {
      stand: stand,
      total: 0
    }
    messages.forEach((message) => {
      data.total+= message.avr_watt
    })
    res.json(data);
  })
})

app.get('/api/v1/generator/:generator/messages', (req, res) => {
  const generator = req.params.generator
  let quantity = parseInt(req.query.q)

  // check if quantity is given, otherwise return all messages
  if (quantity == NaN) {
    quantity = ''
  }

  collections.generators.findOne({
    name: generator
  }, (err, generator) => {
    if (err) return console.log(err)
    collections.messages.find({
      "generator": generator._id
    }, {}).limit(quantity).sort({
      $natural: -1
    }).toArray(function(err, messages) {
      const response = {}
      response.generatorId = generator._id
      response.standName = generator.name
      response.messages = messages
      response.timestamp = Date.now()

      res.json(response)
    })
  })
})

const generate = () => {
  setInterval(function() {
    generateMessages()
  }, 1000)
}

const initGenerator = (generator) => {
  const data = {
    name: generator,
    created_at: Date.now()
  }

  collections.generators.save(data, (err, result) => {
    if (err) return console.log(err)
    console.info('Created generator called `' + data.name + '`')

  })
}

const initStand = (generator, stand) => {
  collections.generators.findOne({
    name: generator
  }, (err, generator) => {
    if (err) return console.log(err)
    const data = {
      name: stand,
      generator: generator._id,
      devices: [],
      created_at: Date.now()
    }

    collections.stands.save(data, (err, result) => {
      if (err) return console.log(err)
      console.info('Created stand called `' + data.name + '` that is connected to generator `' + generator.name + '`')
    })
  })
}

const initDevice = (stand, device) => {
  collections.stands.findOne({
    name: stand
  }, (err, stand) => {
    if (err) return console.log(err)
    const data = {
      name: device,
      stand: stand._id,
      created_at: Date.now()
    }

    collections.devices.save(data, (err, result) => {
      if (err) return console.log(err)
      console.info('Created device called `' + data.name + '` that is connected to stand `' + stand.name + '`')
    })

    const updateData = {}

    if (stand.devices == undefined) {
      updateData.devices = [data]
    } else {
      const devicesArr = stand.devices
      devicesArr.push(data)
      updateData.devices = devicesArr
    }

    collections.stands.findOne({
      _id: stand._id
    }, function(err, stand) {
      collections.stands.updateOne(stand, {
        $set: updateData
      }, (error, result) => {
        if (err) return console.log(err)
      })
    });

  })

}

const generateMessages = () => {
  console.log("generating")
  // return

  collections.stands.find({}, {}).toArray(function(err, stands) {
    stands.forEach((stand) => {
      let multiplier = 0
      collections.settings.findOne({}, function(err, setting) {
        if (err) return console.log(err)
        multiplier = setting.multiplier

        const standData = {
          type: 'stand',
          stand: stand.name,
          timestamp: Date.now(),
          avr_watt: 0,
          min_watt: 0,
          max_watt: 0

        }
        stand.devices.forEach((device) => {
          const deviceData = {
            type: 'device',
            device: device.name,
            stand: device.stand,
            timestamp: Date.now(),
            avr_watt: randomNum(905 * multiplier, 906 * multiplier),
            min_watt: randomNum(865 * multiplier, 867 * multiplier),
            max_watt: randomNum(954 * multiplier, 956 * multiplier)
          }

          standData.avr_watt += deviceData.avr_watt
          standData.min_watt += deviceData.min_watt
          standData.max_watt += deviceData.max_watt

          collections.messages.save(deviceData, (err, result) => {
            if (err) return console.log(err)
          })
        })

        collections.messages.save(standData, (err, result) => {
          if (err) return console.log(err)
        })
      })
    })
  })
}

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

// generate()
