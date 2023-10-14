/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: WAI SUN LAM Student ID: 146691225 Date: 14/10/2023
*
********************************************************************************/
const legoData = require("./modules/legoSets");
const express = require('express');
const path = require('path');
const app = express();
const HTTP_PORT = 8080;

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get("/lego/sets", (req, res) => {
    if (req.query.theme) {
        legoData.getSetsByTheme(req.query.theme).then((sets) => {
            res.json(sets);
        }).catch((err) => {
            res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
        });
    } else {
        legoData.getAllSets().then((sets) => {
            res.json(sets);
        }).catch((err) => {
            res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
        });
    }
});

app.get("/lego/sets/:setNum", (req, res) => {
    legoData.getSetByNum(req.params.setNum).then((set) => {
        if (!set) {
            return res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
        }
        res.json(set);
    }).catch((err) => {
        res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
    });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch(err => {
    console.log("Unable to start the server: " + err);
});
