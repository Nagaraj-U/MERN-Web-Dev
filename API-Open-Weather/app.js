const { response } = require("express");
const express = require("express");
const  app = express();
const https = require("https");//native module no need to install


app.get("/",function(req,res){
    var url = "https://api.openweathermap.org/data/2.5/weather?q=london&appid=eaad2e614ebc3084857816f1cc64d97d&units=metric";//search by city name (https://openweathermap.org/current)
    https.get(url,function(response){
        response.on("data",function(data){
            var weather = JSON.parse(data);
            var temp = weather.main.temp;
            var desciption = weather.weather[0].description
            console.log(temp);
            console.log(desciption);
        })
    });

    res.send("wether api running");
});



app.listen(3000,function(){
    console.log("server started");
})