/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: WAI SUN LAM Student ID: 146691225 Date: 14/10/2023
*
*  Published URL: https://raspberry-hedgehog-ring.cyclic.app
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require('express');
const path = require('path');
const app = express();
const HTTP_PORT = 8080;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});


app.get("/lego/sets", (req, res) => {
    if (req.query.theme) {
        legoData.getSetsByTheme(req.query.theme).then((sets) => {
            res.render("sets", {sets: sets}); 
        }).catch((err) => {
            res.status(404).render("404", { message: "Unable to find requested set." });
        });
    } else {
        legoData.getAllSets().then((sets) => {
            res.render("sets", {sets: sets}); 
        }).catch((err) => {
            res.status(404).render("404", { message: "Unable to find requested set." });
        });
    }
});

app.get("/lego/sets/:setNum", (req, res) => {
  legoData.getSetByNum(req.params.setNum).then(legoSet => {
      if (legoSet) {
          res.render("set", { set: legoSet }); 
      } else {
          res.status(404).render("404", { message: "Unable to find requested set." });
      }
  }).catch(err => {
      res.status(404).render("404", { message: "Unable to find requested set." });
  });
});

app.use((req, res) => {
  res.status(404).render("404", {
      message: "Sorry, we're unable to find what you're looking for.",
  });
});

legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => console.log(`Server listening on: ${HTTP_PORT}`));
}).catch(err => {
  console.error("Unable to start the server:", err);
});

