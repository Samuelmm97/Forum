//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//messages in about.ejs and contact.ejs
const aboutContent = "The purpose of this project is to test Express.js and it's ability to create new elements as a user enters new messages.";
const contactContent = "If you like this project let me know! You can send me a text or call me at 954-240-8181 or send me an email below.";

//boiler plate code
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Database connection
mongoose.connect("mongodb+srv://" + process.env.DATABASE_NAME + ":" + process.env.DATABASE_PASSWORD + "@cluster0.ny0oi.mongodb.net/Forum" , { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to DB");
});

//User makes a post
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

//home page
app.get("/", function(req, res){
  //find and render home page with posts
  Post.find({}, function(err, post) {
    if(err) {
      console.log(err);
    } else {
      res.render("home", {posts: post});
    }
  });

});

//about page
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//contact page
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

//compose new message
app.get("/compose", function(req, res){
  res.render("compose");
});

//When user submits a message make a new post and save it to the database
app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();

  //then redirect to the homepage to see the post
  res.redirect("/");

});

//If post is long allow user to read more by clicking link
app.get("/posts/:postName", function(req, res){
  const requestedID = req.params.postName;
  console.log(requestedID);
  //find the posts ID in database then render it on new page
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

//run the server on either local host or public    
let port = process.env.PORT;
if (port == null || port == "")
  port = 3000;

app.listen(port, function() {
  console.log("Server started...");
});
