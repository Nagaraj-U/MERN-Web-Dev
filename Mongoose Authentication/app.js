//jshint esversion:6
require('dotenv').config()

const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()
const bodyParser = require("body-parser")

//LEVEL 3 security layer
//npm install md5
//hashing : one way almost impossible to decrypt  md5 : message digest
const md5 = require("md5")
console.log(md5("nagaraj"));

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost:27017/secretAuthDB",{useNewUrlParser:true,useUnifiedTopology:true})

const userSchema = new mongoose.Schema(
    {
         email : String,
        password : String
});

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.send("home page")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.post("/register",function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);
    User.insertMany({
        email : username,
        password : password
    },function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets")
        }
    })
})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);  //hashing password got from user for searching in database (since we stored hashed password otherwise they dont match)
    User.findOne({
        email : username
    },function(err,foundUser){
        if(err){
            res.send(err)
        }else{
            if(foundUser.password === password){
                res.render("secrets")
            }else{
                res.send("no such user found")
            }
        }
    })
})


app.listen(3000,function(req,res){
    console.log("server started");
})