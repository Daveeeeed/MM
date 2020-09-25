var express = require("express");
var router = express.Router();
var path = require("path");
var fetch = require("fetch");

/* GET homepage */
router.get("/", function (req, res, next) {
    res.sendFile(path.resolve("views/homepage.html"));
});

/* GET story page (start the game) */
router.get("/story", (req, res) => {
    res.sendFile(path.resolve("views/story.html"));
});

/* GET editor */
router.get("/editor", (req, res) => {
    res.sendFile(path.resolve("views/editor.html"));
});

module.exports = router;
