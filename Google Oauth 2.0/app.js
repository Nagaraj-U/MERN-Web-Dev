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


//First set up app in google developer console
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy; //Oauth
const findOrCreate = require('mongoose-findorcreate')





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


passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    //   console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/secretAuthDB",{useNewUrlParser:true,useUnifiedTopology:true})

const userSchema = new mongoose.Schema(
    {
         email : String,
        password : String,
        googleId : String //to store google profile id of user in Oauth (for session and cookies)
});

userSchema.plugin(passportLocalMongoose); //adding plugin for hashing and salting before mongoose model is compiled 
userSchema.plugin(findOrCreate); //google Oauth method (used as plugin not mongoose function)


const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy())



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.get("/",function(req,res){
    res.send("home page")
})

//get request by passport to google
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile"]
}));


//get request by google after authorizing user
app.get("/auth/google/secrets",
    passport.authenticate( 'google', {
        failureRedirect: "auth/google/login"
}),function(req,res){
    res.redirect("/secrets")
});

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