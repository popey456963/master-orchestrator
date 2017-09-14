// POST /server (id, tick, name, region, game, mode, rcon, password, slots, gslt, sm_enabled) - creates a server
// GET / () - lists servers
// GET /server/:server - gets status of a server
// POST /server/:server (action, data) - does an action on a server
// miles - passpass123$

const express = require('express')
const body_parser = require('body-parser')
const request = require('request-promise')
const app = express()

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))

const Database = require('./modules/Database.js')

const HOST_ADDR = 'http://miles:passpass123$@192.168.1.9'

function success(message) { return { time: +new Date(), status: 200, message } }

app.get('/', async function (req, res) {
  return res.json(Object.assign(success('List of all servers'), {
    data: await Database.listServers()
  }))
})

app.post('/server', async function(req, res) {
    // Find an available server port.
    const server_port = Math.ceil(Math.random() * 20000)
    const rcon = req.body.rcon ? req.body.rcon : 'random'
    const info = {
      id: req.body.id,
      tick: req.body.tick,
      name: req.body.name,
      region: req.body.region,
      game: req.body.game,
      mode: req.body.mode,
      rcon: rcon,
      password: req.body.password,
      slots: req.body.slots,
      gslt: req.body.gslt,
      sm_enabled: req.body.sm_enabled
    }
    await Database.addServer(info)

    const response = Object.assign(success('Server initialisation complete'), {
      action: 'created',
      data: JSON.stringify({
        id: req.body.id,
        ip: "192.168.1.17",
        port: server_port
      })
    })

    request.post(`${HOST_ADDR}/api/`).form(response)
    console.log(response)

    res.json(Object.assign(success('Started server intiailisation successfully'), {
      action: 'create',
      data: req.params.server
    }))
})

app.post('/server/:server', function(req, res) {
  switch(req.body.action) {
    case 'start':
      console.log('starting')
      res.json(Object.assign(success('Starting server ' + req.params.server), { action: 'starting', data: req.params.server }))
      break
    case 'stop':
      console.log('stopping')
      res.json(Object.assign(success('Stopping server ' + req.params.server), { action: 'stopping', data: req.params.server }))
      break
    case 'delete':
      console.log('deleting')
      res.json(Object.assign(success('Deleting server ' + req.params.server), { action: 'deleting', data: req.params.server }))
  }
})

app.listen(3001, function () {
  console.log('Master Orchestrator listening on port 3001')
})