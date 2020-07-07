const express = require('express');
const mongo = require('mongodb').MongoClient;
const fs = require("fs");
const app = express();
const db_url = "mongodb://127.0.0.1:27017";
const dbName = "test";

async function sendFile(req, res) {
    console.log("Requested " + req.path);
    try {
        await fs.promises.access(__dirname + req.url);
        res.sendFile(__dirname + req.url);
    } catch (error) {
        res.sendFile(__dirname + '/html/404.html');
    }
}

function fetchElements(collectionName){
    return mongo.connect(db_url, {useUnifiedTopology: true})
        .then((db) => {
            let dbo = db.db(dbName);
            return dbo.collection(collectionName).find({}).toArray()
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

function editElement(action, collectionName, storyName){
    return mongo.connect(db_url, {useUnifiedTopology: true})
        .then((db) => {
            let dbo = db.db(dbName);
            let obj = { name: storyName };
            switch (action) {
                case "add": return dbo.collection(collectionName).insertOne(obj);
                case "remove": return dbo.collection(collectionName).deleteOne(obj);
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
    res.sendFile(__dirname + '/html/story.html',null,function (err) {});
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
            editElement(req.params.action, req.params.collectionName, req.query.name)
                .then((response) => res.send(response));
        }
    }
})

app.get('*', (req, res) => sendFile(req, res))

app.listen(8000, function () {
    console.log('Server running on port 8000!');
});