socketio = require('socket.io-client')
url = require('url')
telegram = require('node-telegram-bot-api')

TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''


LCB_PROTOCOL = process.env.LCB_PROTOCOL || 'http'
LCB_HOSTNAME = process.env.LCB_HOSTNAME || 'localhost'
LCB_PORT = process.env.LCB_PORT || 5000
LCB_TOKEN = process.env.LCB_TOKEN || ''
LCB_ROOM = ''
HTTP_PROXY = process.env.http_proxy || process.env.HTTP_PROXY

chatURL = url.format({
    protocol: LCB_PROTOCOL,
    hostname: LCB_HOSTNAME,
    port: LCB_PORT,
    query: {
        token: LCB_TOKEN
    },
})


bot = new telegram(TELEGRAM_TOKEN, {polling: true})

io = socketio(chatURL, {autoConnect: false})

io.on('connect', function() {
   io.emit('account:whoami', function(profile) {
       console.log("Connected to LCB bot named %s!", profile.displayName)
   })

   io.emit("rooms:join", LCB_ROOM, function(room) {
       console.log("joined room: " + room.name)
   })
})

io.on('messages:new', function(message) {
    console.log("Received message: %s", message.text)
    bot.sendMessage('-122277940', message.text)
})


bot.getMe().then(function(me) {
    console.log("Connected to bot named %s!", me.username)
    io.connect()
})


bot.on('message', function(msg) {
    console.log("getting messages")
    console.log(msg)
    lcbMessage = {
        room: LCB_ROOM,
        text: msg.text
    }
    io.emit("messages:create", lcbMessage)
})
