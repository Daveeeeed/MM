#!/usr/bin/env node

// Websocket
var ws = require("ws");
var webSocketServer = new ws.Server({ port: 8090 });

webSocketServer.on("connection", (webSocket) => {
  webSocket.on("message", (data) => {
    webSocketServer.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(data);
      }
    });
  });
});
