

const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}

function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*'
        }
    })

    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, {
        autoSave: true
    }));

    gIo.on('connection', socket => {
        console.log('New socket - socket.handshake.sessionID', socket.handshake.sessionID)
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        // if (socket.handshake && socket.handshake.session && socket.handshake.session.user) {
        //     socket.join(socket.handshake.session.user._id)
        // }

        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        socket.on('book stay', hostId => {
            // const { hostId, from, type } = msg
            // console.log('hostId', hostId);
            if (socket.hostId === hostId) return;
            if (socket.hostId) {
                socket.leave(socket.hostId)
            }
            socket.join(hostId)
            // logger.debug('Session ID is', socket.handshake.sessionID)
            socket.hostId = hostId
        })
        // socket.on('chat topic', topic => {
        //     console.log(topic);
        //     if (socket.myTopic === topic) return;
        //     if (socket.myTopic) {
        //         socket.leave(socket.myTopic)
        //     }
        //     socket.join(topic)
        //     // logger.debug('Session ID is', socket.handshake.sessionID)
        //     socket.myTopic = topic
        // })
        socket.on('add notif', msg => {
            console.log('add notif!', msg);
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            // gIo.to(socket.myTopic).emit('chat addMsg', msg)
            console.log('socket.hostId: ' , socket.hostId);
            gIo.to(socket.hostId).emit('notify host', msg)
        })
        socket.on('user-watch', userId => {
            socket.join(userId)
        })

    })
}

function emitToAll({ type, data, room = null }) {
    if (room) gIo.to(room).emit(type, data)
    else gIo.emit(type, data)
}

// TODO: Need to test emitToUser feature
function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data)
}


// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
    if (room) excludedSocket.broadcast.to(room).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}


module.exports = {
    connectSockets,
    emitToAll,
    broadcast,
    emitToUser
}



