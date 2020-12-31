var express = require("express");

var apiRouter = require("./api");
var userRouter = require("./user");

var app = express();

app.use(express.json());
app.use("/public", express.static("public"));

app.use("/api", apiRouter);
app.use("/", userRouter);


module.exports = app;
