#!/usr/bin/env node

const port = "8000";
const WSServer = require("ws").Server;
const server = require("http").createServer();
const app = require("../app");

// Create web socket server on top of a regular http server
let webSocketServer = new WSServer({
  server: server,
});

// Also mount the app here
server.on("request", app);

webSocketServer.on("connection", (webSocket) => {
  webSocket.on("message", (data) => {
    webSocketServer.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(data);
      }
    });
  });
});

server.listen(port, function () {
  console.log("Server running on port 8000!");
});
