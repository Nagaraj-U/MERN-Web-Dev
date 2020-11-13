var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

//getting date

var day = new Date();
//ref : https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
var options = {
    weekday : "long",
    month : "long",
    day : "numeric"
}
var today = day.toLocaleDateString("en-US",options);  //Friday, November 13

//making todo list
var items = ["buy food","cook food","eat food"]

app.get("/",function(req,res){
    res.render("index.ejs",{today : today, newList : items})
})

app.post("/",function(req,res){
    var item = req.body.newItem;  //newItem : is name given in form
    items.push(item);
    res.redirect("/");
})

app.listen(3000,function(){
    console.log("server running");
})