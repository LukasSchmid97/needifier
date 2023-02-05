// server.js

import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

io.on('connection', (socket) => {
    //your code here
    console.log("new connections")
});

server.listen((process.env.PORT || 3000), () => {
    console.log('Started');
});

app.get("/",  (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const connections = [];

io.sockets.on("connection", socket => {
  connections.push(socket);
  console.log(" %s sockets is connected", connections.length);

  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket), 1);
  });

  socket.on("sending message", message => {
    console.log("Message is received :", message);
  
    io.sockets.emit("new message", { message: message });
  });

  socket.on("receiving message", message => {
    console.log("Message is received :", message);
  
    io.sockets.emit("new message", { message: message });
  });

});

