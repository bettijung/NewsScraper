// DEPENDENCIES * ================================================= *
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const method = require("method-override");

const axios = require("axios");
const cheerio = require("cheerio");

// Require all Models
const db = require("./models");

// Define Port
const PORT = process.env.PORT || 3000;

// CONNECT TO MONGODB * =========================================== *
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Initialize Express
const app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


// HANDLEBARS * =================================================== *
app.use(method("_method"));
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


// ROUTES * ======================================================= *
// A GET route to render handlebars main page
app.get("/", (req, res) => {
    db.Article.find({}, null, {sort: {created: -1}}, (err, data) => {
        res.render("index", {articles: data});
    });
});

// A GET route for scraping the NYT Technology website
app.get("/scrape", (req, res) => {
  axios.get("https://www.nytimes.com/section/technology?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page").then((response) => {
    var $ = cheerio.load(response.data);
    $(".story theme-summary").each((i, element) => {
      var result = {};

        // Save the text and href of every article as properties of the result object
        result.title = $(this)
          .children()
          .children(".headline")
          .find("a").text();
        result.imgLink = $(this)
          .children()
          .children()
          .find("img").attr("src");
        result.summary = $(this)
          .children(".summary").text();
        result.link = $(this)
          .children()
          .children("h2")
          .children("a").attr("href");
       
        console.log(result);
    
      // Create a new Article using the result
      db.Article.create(result)
        .then((dbArticle) => console.log(dbArticle))
        .catch((err) => res.json(err));
    });

    // If scraped successfully, send a message to the client
    console.log("Scrape Complete");
    res.redirect("/");
  });
});


// GET Route for grabbing all Articles from the db
app.get("/articles", (req, res) => {
  db.Article.find({})
    .then((dbArticle) => res.json(dbArticle))
    .catch((err) => res.json(err));
});


// GET Route for grabbing saved Articles
app.get("/saved", (req, res) => {
  db.Article.find({"read": true})
    .populate("note")
    .then((data) => {
      var hbsObject = {
        articles: data
      }  
      res.render("saved", {articles: data});
    });
});


// GET Route for grabbing an article by its specific ID and adding a note
app.get("/articles/:id", (req, res) => {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then((dbArticle) => res.json(dbArticle))
    .catch((err) => res.json(err));
});


// POST Route for saving an Article's note
app.post("/articles/:id", (req, res) => {
  db.Note.create(req.body)
  .then((dbNote) => {
    return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
  })
  .then((dbArticle) => {res.json(dbArticle)})
  .catch((err) => {res.json(err)});
});
 

// POST Route for saving an Article
app.post("/articles/save/:id", (req, res) => {
  db.Article.findOneAndUpdate({_id: req.params.id}, {"read": true})
  .exec((err, doc) => {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

// DELETE Route for deleting an Article's note
// app.delete("/notes/delete/:not_id/:article_id", (req, res) => {
//     db.Note.findOneAndRemove({"_id": req.params.note_id }, (err) => {
//       if (err) {
//         console.log(err);
//         res.send(err);
//       }
//       else {
//         Article.findOneAndUpdate({"_id": req.params.article_id}, {$pull: {"notes": req.params.note_id}})
//           .exec((err) => {
//             if (err) {
//               console.log(err);
//               res.send(err);
//             }
//             else {
//               res.send("Note Deleted");
//             }
//           });
//       }
//     });
//   });


// POST Route to delete an article
app.post("/articles/delete/:id", (req, res) => {
    db.Article.findOneAndUpdate({_id: req.params.id}, {"read": false})
    .exec((err, doc) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(doc);
      }
    });
});



// START SERVER * ================================================= *
app.listen(PORT, () => {
  console.log(`This app is running on port: ${PORT}`);
});