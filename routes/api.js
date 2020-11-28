var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
const multer = require("multer");
var upload = multer({ dest: '.' });

// WEB SOCKET
var ws = require("ws");
var webSocketServer = new ws.Server({ port: 8080 });

webSocketServer.on("connection", (webSocket) => {
    webSocket.on("message", (data) => {
        webSocketServer.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(data);
            }
        });
    });
});

// MONK
var monk = require("monk");
const { response } = require("express");
const { data } = require("jquery");
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

router.get("/", function (req, res, next) {
    res.send("Api page - you shouldn't be here.");
});

router.post("/stories/new", (req, res) => {
    db.get("stories")
        .insert(req.body)
        .then((response) => res.send(response));
});

router.post("/missions/new", (req, res) => {
    db.get("missions")
        .insert(req.body)
        .then((response) => res.send(response));
});

router.post("/activities/new", (req, res) => {
    db.get("activities")
        .insert(req.body)
        .then((response) => res.send(response));
});

router.post("/stories/delete", (req, res) => {
    db.get("stories")
        .findOneAndDelete({ key: req.body.key })
        .then((response) => res.send(response));
});

router.post("/missions/delete", (req, res) => {
    db.get("missions")
        .findOneAndDelete({ key: req.body.key })
        .then((response) => res.send(response));
});

router.post("/activities/delete", (req, res) => {
    db.get("activities")
        .findOneAndDelete({ key: req.body.key })
        .then((response) => res.send(response));
});

router.post("/stories/edit", (req, res) => {
    db.get("stories")
        .update(
            { key: req.body.key },
            {
                $set: {
                    title: req.body.title,
                    paths: req.body.paths,
                    settings: req.body.settings,
                },
            }
        )
        .then((response) => res.send(response));
});

router.post("/missions/edit", (req, res) => {
    db.get("missions")
        .update(
            { key: req.body.key },
            {
                $set: {
                    title: req.body.title,
                    activities: req.body.activities,
                    player: req.body.player,
                    first_activity: req.body.first_activity,
                },
            }
        )
        .then((response) => res.send(response));
});

router.post("/activities/edit", (req, res) => {
    db.get("activities")
        .update(
            { key: req.body.key },
            {
                $set: {
                    title: req.body.title,
                    elements: req.body.elements,
                    player: req.body.player,
                    correct: req.body.correct,
                    wrong: req.body.wrong,
                    time: req.body.time,
                },
            }
        )
        .then((response) => res.send(response));
});

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

router.get("/activities", (req, res) => {
    db.get("activities")
        .find(req.query)
        .then((response) => {
            res.send(response);
        });
});

router.get("/tutor", (req, res) => {
    db.get("games")
        .find({
            game_key: req.query.game_key,
        })
        .then((response) => res.send(response[0]));
});

router.post("/tutor", (req, res) => {
    db.get("games")
        .insert({
            story_key: req.query.story_key,
            game_key: req.query.game_key,
            players: [],
        })
        .then(() => res.send());
});

// Player esegue l'update dello status
router.post("/player/update", (req, res) => {
    db.get("games")
        .find({
            game_key: req.query.game_key,
        })
        .then((response) => {
            let db_index = findPlayerIndex(
                req.query.player_id,
                response[0].players
            );
            response[0].players[db_index].status = req.body.status;
            db.get("games")
                .update(
                    { game_key: req.query.game_key },
                    {
                        $set: {
                            players: response[0].players,
                        },
                    }
                )
                .then(() => {
                    res.send(response[0].players[db_index]);
                });
        });
});

// Chiamata solo una volta all'apertura del player
router.get("/player", (req, res) => {
    db.get("games")
        .find({
            game_key: req.query.game_key,
        })
        .then((response) =>
            res.send(findPlayer(req.query.player_id, response[0].players))
        );
});

// Chiamata alla creazione di un nuovo player
router.post("/player", (req, res) => {
    db.get("games")
        .find({
            game_key: req.query.game_key,
        })
        .then((response) => {
            if (response.length == 1) {
                response[0].players.push({
                    id: req.query.player_id,
                    name: req.query.player_id,
                    username: "Nome in codice",
                    status: {
                        mission: null,
                        activity: null,
                        time_stuck: null,
                    },
                    points: 0,
                    time: 0,
                });
                db.get("games")
                    .update(
                        { game_key: req.query.game_key },
                        {
                            $set: {
                                players: response[0].players,
                            },
                        }
                    )
                    .then(() => {
                        res.send({ ok: true });
                    });
            } else res.send({ ok: false });
        });
});

// Ritorna l'oggetto player se trovato nella partita
function findPlayer(player_id, players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == player_id) return players[i];
    }
}

// Ritorna l'indice dell'oggetto player se trovato nella partita
function findPlayerIndex(player_id, players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == player_id) return i;
    }
}

// Tutor esegue fetch dei dati dei giocatori
router.get("/tutor/update", (req, res) => {
    db.get("games")
        .find({
            game_key: req.query.game_key,
        })
        .then((response) => res.send(response));
});

router.post("/tutor/update", (req, res) => {
    db.get("games")
        .find({
            game_key: req.query.game_key,
        })
        .then((response) => {
            let player_on_db = findPlayer(
                req.query.player_id,
                response[0].players
            );
            let db_index = findPlayerIndex(
                req.query.player_id,
                response[0].players
            );
            player_on_db.name = req.body.name;
            response[0].players[db_index] = player_on_db;
            db.get("games")
                .update(
                    { game_key: req.query.game_key },
                    {
                        $set: {
                            players: response[0].players,
                        },
                    }
                )
                .then(() => {
                    res.send(player_on_db);
                });
        });
});

router.get("/images/:key", (req, res) => {
    db.get("images").findOne({ key: req.params.key }, (err, result) => {
        if (err) return console.log(err);
        res.contentType("image/jpeg");
        res.send(result.image.buffer);
    });
});

router.post("/images/:key", upload.single("photo"), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString("base64");
    var finalImg = {
        key: req.params.key,
        contentType: req.file.mimetype,
        image: new Buffer.from(encode_image, "base64"),
    };
    db.get("images").insert(finalImg, (err, result) => {
        console.log(result);
        if (err) return console.log(err);

        console.log("saved to database");
        res.send({
            ok: !err,
        });
    });
});

module.exports = router;
