//jshint esversion:6
require('dotenv').config()

const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const app = express()
const bodyParser = require("body-parser")

//authentication
const session = require('express-session')  
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")




app.use(express.static("public"))
app.set("view engine", "ejs")


app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//express session documentaion
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())  //initializing passport for auth
app.use(passport.session())  //starting session


mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/secretAuthDB",{useNewUrlParser:true,useUnifiedTopology:true})

const userSchema = new mongoose.Schema(
    {
         email : String,
        password : String
});

userSchema.plugin(passportLocalMongoose); //adding plugin for hashing and salting before mongoose model is compiled 

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser()); //create cookie
passport.deserializeUser(User.deserializeUser()); //destroy cookie




app.get("/",function(req,res){
    res.send("home page")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{

          res.redirect("/login")
    }
      
    
})

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/")
})


app.post("/register",function(req,res){
    User.register({username : req.body.username},req.body.password,function(err){
        if(err){
            console.log(err);
            res.redirect("/register")
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })
        }
    })
    
})

app.post("/login",function(req,res){
   const user = new User({
       username : req.body.username,
       password : req.body.password
   });
   req.login(user,function(err,user){
       if(err){
           console.log(err);
           res.redirect("/login")
       }else{
           passport.authenticate("local")(req,res,function(){
               res.redirect("/secrets")
           })
       }
   }) 
})


app.listen(3000,function(req,res){
    console.log("server started");
})