/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: WAI SUN LAM Student ID: 146691225 Date: 27/11/2023
*
*  Published URL: https://raspberry-hedgehog-ring.cyclic.app 
*
********************************************************************************/

const express = require("express");
const app = express();
app.set("view engine", "ejs");
const HTTP_PORT = process.env.PORT || 8080;
const path = require("path");
const legoData = require("./modules/legoSets");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

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


app.get("/lego/addSet", (req, res) => {
    legoData.getAllThemes()
      .then(themeData => {
        res.render("addSet", { themes: themeData });
      })
      .catch(error => {
        console.error(error);
      });
  });
  
app.post('/lego/addSet', (req, res) => {
    const setData = req.body;
    legoData.addSet(setData)
      .then(() => {
        res.redirect('/lego/sets');
      })
      .catch(err => {
        console.error(err);
        res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err.message}` });
      });
  });

app.get("/lego/editSet/:num", (req, res) => {
    const setNum = req.params.num;
    legoData.getSetByNum(setNum)
      .then(setData => {
        return legoData.getAllThemes()
          .then(themeData => {
            res.render("editSet", { themes: themeData, set: setData });
          });
      })
      .catch(error => {
        console.error(error);
        res.status(404).render("404", { message: "Cannot retrieve set" });
      });
  });

app.post('/lego/editSet', (req, res) => {
    const setnum = req.body.set_num;
    const data = req.body;
    legoData.editSet(setnum, data)
      .then(() => {
        res.redirect('/lego/sets');
      })
      .catch(err => {
        console.error(err);
        res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err.message}` });
      });
  });
  
app.get("/lego/deleteSet/:num", (req, res) => {
    const setNum = req.params.num;
    legoData.deleteSet(setNum)
      .then(() => {
        res.redirect('/lego/sets');
      })
      .catch(err => {
        console.error(err); 
        res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err.message}` });
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
  


