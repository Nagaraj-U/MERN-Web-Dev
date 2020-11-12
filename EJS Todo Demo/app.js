var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.set("view engine","ejs");

var day = new Date();
var today = day.getDay();
var dayInfo = "";

app.get("/",function(req,res){
  
    if(today === 1){
        dayInfo = "monday";
    }else if(today === 2){
        dayInfo = "tuesday";
    }else if(today === 3){
        dayInfo = "wednesday";
    }else if(today === 4){
        dayInfo = "thursday";
    }else if(today === 5){
        dayInfo = "friday";
    }else if(today === 6){
        dayInfo = "saturday";
    }else{
        dayInfo = "sunday";
    }

    res.render("index.ejs",{day_info : dayInfo })
})

app.listen(3000,function(){
    console.log("server running");
})