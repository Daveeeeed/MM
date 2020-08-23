var express = require("express");
var router = express.Router();

/* MONK setup */
var monk = require("monk");
const { response } = require("express");
var user = "davide";
var passw = "zJRJBT3skYKKVWaw";
var dbName = "techweb";
//const url = "mongodb://127.0.0.1:27017";
var url =
    "mongodb+srv://" +
    user +
    ":" +
    passw +
    "@clustertw.wi8xg.gcp.mongodb.net/" +
    dbName +
    "?retryWrites=true&w=majority";
var db = monk(url);

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/* GET api homapage */
router.get("/", function (req, res, next) {
    res.send("api page");
});

router.get("/stories/delete", (req, res) => {
    db.get("stories")
        .remove({ key: parseInt(req.query.key) })
        .then((response) => res.send(response));
});

router.post("/stories/new", (req, res) => {
    db.get("stories")
        .insert(req.body)
        .then((response) => res.send(response));
});

/* GET stories data */
router.get("/stories", (req, res) => {
    db.get("stories")
        .find(req.query)
        .then((response) => {
            res.send(response);
        });
});

module.exports = router;
