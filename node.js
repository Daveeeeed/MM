/* EXPRESS - routing */
const express = require('express');
const app = express();

/* MONGODB - main database */
const mongo = require('mongodb').MongoClient;
const db_url = "mongodb://127.0.0.1:27017";
const dbName = "techweb";

/* MULTER - parse form-data from post request */
const bodyParser = require('body-parser');

/* FS - filesystem */
const fs = require("fs");

/* CRYPTO - hashing functions */
const crypto = require('crypto-js')

const middlewares = [
    bodyParser.urlencoded({extended: true})
]

app.use(middlewares);

function sendFile(req, res) {
    return new Promise(resolve => {
        fs.access(__dirname + req.url, fs.constants.F_OK, (err) =>{
            if (err) {
                res.sendFile(__dirname + '/html/404.html');
                console.log("ERROR: requested " + req.path);
            }
            res.sendFile(__dirname + req.url);
        })
        resolve();
    })
}

function fetchElements(collectionName, filters){
    return mongo.connect(db_url, {useUnifiedTopology: true})
        .then((db) => {
            let dbo = db.db(dbName);
            return dbo.collection(collectionName).find(filters).toArray()
        })
        .then((success, error) => {
            if (error) {
                console.log(error);
                return undefined;
            } else {
                return success;
            }
        })
        .catch(err => {
            console.log(err);
            return undefined
        })
}

function editElement(action, collectionName, object){
    return mongo.connect(db_url, {useUnifiedTopology: true})
        .then((db) => {
            let dbo = db.db(dbName);
            switch (action) {
                case "add": return dbo.collection(collectionName).insertOne(object);
                case "remove": return dbo.collection(collectionName).deleteOne(object);
            }
        })
        .then((success, error) => {
            if (error) {
                console.log(error);
                return undefined;
            } else {
                return success;
            }
        })
        .catch(err => {
            console.log(err);
            return undefined
        })
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/auth.html',null,function (err) {});
})

app.get(['/homepage', '/home'], (req, res) => {
    res.redirect('/');
})

app.get('/api/:collectionName/:action', (req, res) => {
    switch(req.params.action){
        case "fetch": {
            fetchElements(req.params.collectionName)
                .then((response) => res.send(response));
            break;
        }
        case "remove":
        case "add": {
            let obj = { name: req.query.name };
            editElement(req.params.action, req.params.collectionName, obj)
                .then(() => res.send());
        }
    }
})

app.get('/editor', (req, res) => {
    res.sendFile(__dirname + '/html/editor.html',null,function (err) {});
})

app.post('/register', (req, res) => {
    let user = {
        name: req.body.name,
        surname: req.body.surname,
        company: req.body.company,
        email: req.body.email,
        password: req.body.password,
        user_id: "RANDOM",
        avatar: req.body.avatar,
        preferred_settings: null
    }
    editElement('add', 'utenti', user)
        .then(() => res.redirect('/'))
});

app.post('/login', (req, res) => {
    let user = {
        email: req.body.email,
        password: req.body.password
    }
    fetchElements('utenti', user).
        then(response =>{
            if (response.length == 1){
                console.log(response)
                response.json()
                    .then(json => {
                        res.send(json.avatar);
                    })
            } else {
                res.send('Dati errati');
            }
    })
});

app.get('*', (req, res) => sendFile(req, res))

app.listen(8000, function () {
    console.log('Server running on port 8000!');
});