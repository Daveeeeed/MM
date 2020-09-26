var express = require("express");
var router = express.Router();
var path = require("path");

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

router.get("/story", (req, res) => {
    res.sendFile(path.resolve("views/story.html"));
});

module.exports = router;
