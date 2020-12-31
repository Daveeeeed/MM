var express = require("express");
var router = express.Router();
var path = require("path");

/* GET test route */
router.get("/testing", function (req, res, next) {
  res.send("Test route");
});

/* GET homepage */
router.get("/", function (req, res, next) {
  res.sendFile("views/homepage.html", { root: __dirname });
});

/* GET editor */
router.get("/play", (req, res) => {
  res.sendFile("views/access.html", { root: __dirname });
});

/* GET editor */
router.get("/editor", (req, res) => {
  res.sendFile("views/editor.html", { root: __dirname });
});

router.get("/tutor", (req, res) => {
  res.sendFile("views/tutor.html", { root: __dirname });
});

router.get("/player", (req, res) => {
  res.sendFile("views/player.html", { root: __dirname });
});

router.get("/browse", (req, res) => {
  res.sendFile("views/browse.html", { root: __dirname });
});

router.get("/comp/:app/:name", (req, res) => {
  let app = req.params.app;
  let component_name = req.params.name;
  res.sendFile("components/" + app + "/" + component_name, { root: __dirname });
});

router.get("/*", (req, res) => {
  res.sendFile("views/404.html", { root: __dirname });
});

module.exports = router;
