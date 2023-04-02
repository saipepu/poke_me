const express = require('express');
const app = express();
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config();

//middleware
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET","POST"],
    credentials: true
  }
})

const start = () => {
  io.on('connection', (socket) => {
    console.log('One Client Connected')
    socket.emit('server', 'A Reponse from Server')
  
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log('A user has joined room - ', room);
    })
    socket.on('sendMessage', (data) => {
      socket.to(data.room).emit('receiveMessage', data.message);
    })
    socket.on('disconnect', () => {
      console.log('A client')
    })
  })
}
start();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log('Server listening on PORT ' + PORT))