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

/* DELETE a story */
router.post("/stories/delete", (req, res) => {
    db.get("stories")
        .findOneAndDelete({ key: req.body.key })
        .then((response) => res.send(response));
});

/* CREATE a new story */
router.post("/stories/new", (req, res) => {
    db.get("stories")
        .insert(req.body)
        .then((response) => res.send(response));
});

/* REPLACE/EDIT a story */
router.post("/stories/edit", (req, res) => {
    db.get("stories")
        .update({ key: req.body.key },{
                $set: {
                    title: req.body.title,
                    stages: req.body.stages,
                    settings: req.body.settings,
                },
            }
        )
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

router.get("/missions", (req, res) => {
    db.get("missions")
        .find(req.query)
        .then((response) => {
            res.send(response);
        });
});

module.exports = router;
