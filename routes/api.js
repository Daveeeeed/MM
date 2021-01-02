var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var upload = multer();

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
      let db_index = findPlayerIndex(req.query.player_id, response[0].players);
      response[0].players[db_index].status = req.body.status;
      response[0].players[db_index].mission_points = req.body.mission_points;
      response[0].players[db_index].mission_activities =
        req.body.mission_activities;
      response[0].players[db_index].total_points = req.body.total_points;
      response[0].players[db_index].total_activities =
        req.body.total_activities;
      response[0].players[db_index].time = req.body.time;
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
    .then((response) => {
      if (response.length)
        res.send(findPlayer(req.query.player_id, response[0].players));
      else res.sendStatus(400);
    });
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
            path: null,
            mission: null,
            activity: null,
            // tempo impiegato per l'attività corrente
            time_stuck: 0,
          },
          // tempo totale di gioco
          time: 0,
          // punti della missione corrente
          mission_points: 1,
          // attività visitate nella missione corrente
          mission_activities: 1,
          // punti totali
          total_points: 1,
          // attività visitate totali
          total_activities: 1,
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

// Tutor aggiorna i dati dei giocatori
router.post("/tutor/update", (req, res) => {
  db.get("games")
    .find({
      game_key: req.query.game_key,
    })
    .then((response) => {
      let db_index = findPlayerIndex(req.query.player_id, response[0].players);
      response[0].players[db_index].name = req.body.name;
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

router.post("/uploadPhoto", upload.single("photo"), (req, res) => {
  console.log(__dirname);
  try {
    let data = req.file.buffer;
    let type;
    let dir_path;
    if (req.file.mimetype.includes("image/")) {
      type = req.file.mimetype.replace("image/", "");
      dir_path = "/webapp/MM/public/uploads/images";
    } else if (req.file.mimetype.includes("video/")) {
      type = req.file.mimetype.replace("video/", "");
      dir_path = "/webapp/MM/public/uploads/videos";
    } else {
      throw "Mimetype Error";
    }
    let data_path = dir_path + "/" + Date.now() + "." + type;
    if (!fs.existsSync(dir_path)) fs.mkdirSync(dir_path); // check folder existance
    fs.writeFile(data_path, data, "base64", (err) => {
      console.log(err)
    }); // save photo
    // stampa il contenuto della cartella
    fs.readdir(dir_path, function (err, items) {
      for (var i = 0; i < items.length; i++) {
        console.log(items[i]);
      }
    });
    
    let response_path = data_path.replace(
      "/webapp/MM/public",
      "http://site181982.tw.cs.unibo.it/public"
    );
    res.send({ path: response_path });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/resetGames", (req, res) => {
  db.get("games")
    .remove()
    .then(() => {
      res.send("Games successfully removed.");
    });
});

/* GET test route */
router.get("/testing", function (req, res, next) {
  res.send("Test route");
});

module.exports = router;
