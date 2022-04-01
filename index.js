const os = require('os');
const net = require('net')
const crypto = require('crypto')
const Gun = require('gun')
const Gunnel = Gun.chain.gunnel = function(params){
  if(!params) throw new Error('Cannot initialize without params')
  let peers
  if(params.peers && params.peers.length > 0) peers = this.peers = params.peers
  let id = this.id = crypto.randomBytes(20).toString('hex')
  const gun = new Gun(peers ? peers : undefined)
  if(!params.clientPort && !params.serverPort && params.port) {
    port = this.port = params.port
  }
  const topic = this.topic = crypto.createHash('sha256').update(params.topic).digest('hex')
  const secret = this.secret = crypto.createHash('sha256').update(params.secret).digest('hex')
  let user = gun.user()
  
  let connections = []
  user.create(this.topic, this.secret, ack => {
    user.auth(topic, secret)
  })
  gun.on('auth', ack => {
    console.log('authorized!')
    let init = this.init = {id: id, time: new Date().getTime()}

    setTimeout(()=>{
      if(connections.length > 1) {
        console.log('I REALLY am the server')
      }
    }, 5 * 1000)
    user.get(topic).on(data => {
      data = JSON.parse(data)
      console.log(data)
      if(data) {
        connections.push(data)
      }
      let now = new Date().getTime()

      if(data === null){
        //user.get(topic).put(JSON.stringify(init))
        console.log('NULL - I am the server')
      }
      if(data && data.id === id){
        console.log('got self')
        //user.get(topic).put(JSON.stringify({}))
      }
    })
    //user.get(topic).put(null)
    user.get(topic).put(JSON.stringify(init))
    /*
    user.get(topic).put(init)
    user.get(topic).once(data => {
      console.log(data)
      if(init > data){
        init.type = 'server'
      } else {
        init.type = 'client'
      }
    })
    */

    
    process.on('SIGINT', ev => {
      user.get(topic).put(null)
      setTimeout(()=>{
        process.exit(100)
      },100)
    })
    
  })

  console.log(this)

  return gun
}
module.exports = Gunnel