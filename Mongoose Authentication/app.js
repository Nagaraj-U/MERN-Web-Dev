//jshint esversion:6
require('dotenv').config()

const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()
const bodyParser = require("body-parser")
const encrypt = require("mongoose-encryption")

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost:27017/secretAuthDB",{useNewUrlParser:true,useUnifiedTopology:true})

const userSchema = new mongoose.Schema(
    {
         email : String,
        password : String
});

// const secret = " thisismysecret1111111 ";

//drop the database and recreate it tp apply encryption

userSchema.plugin(encrypt,{secret : process.env.SECRET , encryptedFields : ["password"]});

const User = mongoose.model("User",userSchema);




// const newUser = new User({email:"nags@123",password:"nagaraj@123"})
// newUser.save();

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
    const password = req.body.password;
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
    const password = req.body.password;
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