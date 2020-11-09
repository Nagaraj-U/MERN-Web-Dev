var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
    var weight = Number(req.body.num1);
    var height = Number(req.body.num2);
    var bmi = Number(( weight + height )/2);
    res.send("BMI is " + bmi);
})

app.listen(3000,function(){
    console.log("server started");
});