//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to my message board! I created this website using Node.js, MongoDB, Express.js, CSS, and Bootstrap. If you like this project let me know about it by clicking \"Contact Us\" above";
const aboutContent = "The purpose of this project is to test Express.js and it's ability to create new elements as a user enters new messages.";
const contactContent = "If you like this project let me know! You can send me a text or call me at 954-240-8181 or send me an email below.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://" + process.env.DATABASE_NAME + ":" + process.env.DATABASE_PASSWORD + "@cluster0.ny0oi.mongodb.net/Forum" , { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to DB");
});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, post) {
    if(err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: post
        });
    }
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedID = req.params.postName;
  console.log(requestedID);
    Post.findOne({_id: requestedID}, function(err, post) {
      if (err) {
        console.log(err);
      } else {
            console.log(post);
            res.render("post", {
              title: post,
              content: post
            });
          }
        });
    });
let port = process.env.PORT;
if (port == null || port == "")
  port = 3000;

app.listen(port, function() {
  console.log("Server started...");
});
