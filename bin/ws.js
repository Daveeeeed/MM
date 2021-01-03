#!/usr/bin/env node

// Websocket
var ws = require("ws");
var webSocketServer = new ws.Server({ port: 8100 });

webSocketServer.on("connection", (webSocket) => {
  webSocket.on("message", (data) => {
    webSocketServer.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(data);
      }
    });
  });
});

const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Server per websocket')
})

app.listen(port, () => {
  console.log("Server avviato")
})
