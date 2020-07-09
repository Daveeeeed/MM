const express = require('express');
const fs = require('fs');
const app = express();
const database = "/json/root_db.json";

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

function fetchDatabase(){
    return new Promise(resolve => {
        fs.readFile(__dirname + database, 'utf8', (err, data) => {
            if (err) throw err;
            resolve(JSON.parse(data));
        })
    })
}

function getDatabaseCollections() {
    return fetchDatabase()
        .then(response => new Promise(resolve => {
            resolve(response.collections);
        }))
}

function fetchCollection(collectionName){
    return getDatabaseCollections()
        .then(response => new Promise(resolve => {
            for (let i = 0; i < response.length; i += 1){
                if (response[i].name == collectionName){
                    resolve(response[i]);
                }
            }
        }))
        .then(response => new Promise(resolve => {
            fs.readFile(__dirname + response.path, 'utf8', (err, data) => {
                if (err) throw err;
                resolve(JSON.parse(data));
            })
        }))
}

function getCollectionElements(collectionName) {
    return fetchCollection(collectionName)
        .then(response => new Promise(resolve => {
            resolve(response.elements);
        }))
}

function fetchElements(collectionName, elementName){
    return fetchCollection(collectionName)
        .then(response => new Promise(resolve => {
            for (let i = 0; i < response.length; i += 1){
                if (response[i].name == elementName){
                    resolve(response[i]);
                }
            }
        }))
        .then(response => new Promise(resolve => {
            fs.readFile(__dirname + response.path, 'utf8', (err, data) => {
                if (err) throw err;
                resolve(JSON.parse(data));
            })
        }))
}

function editElement(action, collectionName, storyName){
    return fetchCollection(collectionName)
        .then(response => new Promise(resolve => {
            switch (action) {
                case "add": {
                    let obj = {
                        id: '__00000000__',
                        name: storyName,
                        path: ('/json/' + storyName + '.json')
                    };
                    response.elements.push(obj);
                    break;
                }
                case "remove": {
                    response.elements.forEach((item) =>{
                        if (item.name == storyName) response.elements.splice(response.elements.indexOf(item.name),1);
                    })
                }
            }
            let json = JSON.stringify(response, null, 2);
            fs.writeFile(__dirname + response.path, json,'utf8', (err, data) => {
                if (err) throw  err;
                resolve();
            })
        }))
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
            getCollectionElements(req.params.collectionName)
                .then(response => res.send(response))
            break;
        }
        case "remove":
        case "add": {
            editElement(req.params.action, req.params.collectionName, req.query.name)
                .then(() => res.send());
        }
    }
})

app.get('*', (req, res) => sendFile(req, res))

app.listen(8000, function () {
    console.log('Server running on port 8000!');
});