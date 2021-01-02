var express = require("express");

var apiRouter = require("./routes/api");
var userRouter = require("./routes/user");

var app = express();

app.use(express.json());
app.use("/public", express.static("/webapp/MM/public"));

app.use((req, res, next) => {
  console.log(req.protocol);
  console.log(re.secure);
  if (req.protocol == "http") {
    res.redirect("https://site181982.tw.cs.unibo.it" + req.originalUrl);
  } else next();
});

app.use("/api", apiRouter);
app.use("/", userRouter);

module.exports = app;
