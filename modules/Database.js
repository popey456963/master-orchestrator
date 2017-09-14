// POST /server (id, tick, name, region, game, mode, rcon, password, slots, gslt, sm_enabled) - creates a server
// DELETE /server/:server - deletes a server
// GET / () - lists servers
// GET /serserverver/:server - gets status of a server
// POST //:server (action, data) - does an action on a server

global.sqlite = require('sqlite')

module.exports.listServers = async function() {
  return sqlite.all('SELECT * FROM instances')
}

module.exports.addServer = async function(data) {
  return sqlite.all('INSERT INTO instances VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', data.id, '1', data.tick, data.name, data.region, data.game, data.mode, data.rcon, data.password, data.slots, data.gslt, data.sm_enabled, false)
}

;(async () => {
  await sqlite.open('./sqlite.db')
  await sqlite.all('CREATE TABLE IF NOT EXISTS instances (id TEXT, server TEXT, tick FLOAT, name TEXT, region TEXT, game TEXT, mode TEXT, rcon TEXT, password TEXT, slots INT, gslt TEXT, sm_enabled BOOLEAN, running BOOLEAN);')
})()