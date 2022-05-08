const express = require('express')

const sPORT = 5000

const app = express()

app.use(express.static('public'))

const apiRouter = require('./routes/api.js')
app.use('/api', apiRouter)

app.listen(sPORT, () => console.log(`server started on ${sPORT}`))

// ws //
const coords = {}

const ws = require('ws')

const wsPORT = sPORT + 1

const wss = new ws.Server({
  port: wsPORT
}, () => console.log('ws started on port ' + wsPORT))

wss.on('connection', function connection(ws) {
  ws.on('message', function(message) {

    const objMessage = JSON.parse(message.toString())

    if (objMessage['close']) {
      delete coords[objMessage['close']]
    }

    coords[objMessage.id] = {
      x: objMessage.x,
      y: objMessage.y
    }

    wss.clients.forEach(client => {
      if (client.readyState == ws.OPEN) {
        client.send(JSON.stringify(coords))
      }
    })
  })
})