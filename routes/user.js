var express = require("express");
var router = express.Router();
var path = require("path");
var base_path = "/webapp/MM/";

router.get("http://*", (req, res) => {
  res.redirect("https://site181982.tw.cs.unibo.it" + req.path)
})

/* GET homepage */
router.get("/", function (req, res, next) {
  res.sendFile("views/homepage.html", { root: base_path });
});

/* GET editor */
router.get("/play", (req, res) => {
  res.sendFile("views/access.html", { root: base_path });
});

/* GET editor */
router.get("/editor", (req, res) => {
  res.sendFile("views/editor.html", { root: base_path });
});

router.get("/tutor", (req, res) => {
  res.sendFile("views/tutor.html", { root: base_path });
});

router.get("/player", (req, res) => {
  res.sendFile("views/player.html", { root: base_path });
});

router.get("/browse", (req, res) => {
  res.sendFile("views/browse.html", { root: base_path });
});

router.get("/comp/:app/:name", (req, res) => {
  let app = req.params.app;
  let component_name = req.params.name;
  res.sendFile("components/" + app + "/" + component_name, { root: base_path });
});

router.get("/*", (req, res) => {
  res.sendFile("views/404.html", { root: base_path });
});

module.exports = router;
