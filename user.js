var express = require("express");
var router = express.Router();
var path = require("path");

/* GET test route */
router.get("/testing", function (req, res, next) {
  res.send("Test route");
});

/* GET homepage */
router.get("/", function (req, res, next) {
  res.sendFile(path.resolve("views/homepage.html"));
});

/* GET editor */
router.get("/play", (req, res) => {
  res.sendFile(path.resolve("views/access.html"));
});

/* GET editor */
router.get("/editor", (req, res) => {
  res.sendFile(path.resolve("views/editor.html"));
});

router.get("/tutor", (req, res) => {
  res.sendFile(path.resolve("views/tutor.html"));
});

router.get("/player", (req, res) => {
  res.sendFile(path.resolve("views/player.html"));
});

router.get("/browse", (req, res) => {
    res.sendFile(path.resolve("views/browse.html"));
  });

router.get("/comp/:app/:name", (req, res) => {
  let app = req.params.app;
  let component_name = req.params.name;
  res.sendFile(path.resolve("components/" + app + "/" + component_name));
});

router.get("/*", (req, res) => {
    res.sendFile(path.resolve("views/404.html"));
});

module.exports = router;
