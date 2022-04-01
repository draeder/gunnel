const Gun = require('gun')
const SEA = require('gun/sea')
const Gunnel = require('./index') // require('gunnel')

let topic = 'a unique topic to connect on'
let secret = 'a secure private secret'

let opts = {
  topic: topic,
  secret: secret,
  peers: ['https://relay.peer.ooo/gun'],
  port: 8041,
  //clientPort: 8040, // only required for local testing
  //serverPort: 8041 // only required for local testing
}

const gunnel = new Gunnel(opts)
