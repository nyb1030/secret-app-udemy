//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const app = express();

mongoose.connect('mongodb://localhost:27017/userDB');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
})

const User = mongoose.model('User', userSchema);

const saltRounds = 10;

app.get("/", function(req, res){
  res.render("home")
})

app.get("/", function(req, res){
  res.render("home")
})

app.get("/login", function(req, res){
  res.render("login")
})

app.get("/register", function(req, res){
  res.render("register")
})

app.post("/register", function(req, res){

  const email = req.body.username
  const password = req.body.password

  bcrypt.hash(password, saltRounds, function(err, hash) {
    const newUser = new User ({
      email: email,
      password: hash
    })
    newUser.save(function(err){
      if (err){
        console.log(err);
      } else {
        res.render("secrets")
      }
    })
  });
})

app.post("/login", function(req, res){
  const email = req.body.username
  const password = req.body.password

  User.findOne({email: email}, function(err, foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true){
            res.render("secrets")
          } else {
            console.log("Password does not match");
            res.redirect("/")
          }
        })
      } else {
        console.log("User not found");
        res.redirect("/")
      }
    }
  })

})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
