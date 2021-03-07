//jshint esversion:6
require('dotenv').config()

const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()
const bodyParser = require("body-parser")

//level 4 security   src: https://www.npmjs.com/package/bcrypt
//SALTING
// passwrod + random number (salt ) -> hashing -> hashed password       hash and salt is stored in databse

//salt rounds 
//password+salt - >hashed password + salt -> hashed password      done for k rounds

const bcrypt = require('bcrypt');
const saltRounds = 10;


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
    const password = (req.body.password);
    bcrypt.hash(password, saltRounds, function(err, hash) { //hash : hashed password coming from callback
    // Store hash in your password DB.
        User.insertMany({
            email : username,
            password : hash
        },function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets")
            }
        })
    });
    
})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = (req.body.password);
    User.findOne({
        email : username
    },function(err,foundUser){
        if(err){
            res.send(err)
        }else{
            // if(foundUser.password === password){
            //     res.render("secrets")
            // }else{
            //     res.send("no such user found")
            // }
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) { //compare password from user and password from founduser from database
                    if(result){
                        res.render("secrets")
                    }else{
                        res.send("no such user found")
                    }
                });
            }
            
        }
    })
})


app.listen(3000,function(req,res){
    console.log("server started");
})