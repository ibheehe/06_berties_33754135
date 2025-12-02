const express = require('express');
const router = express.Router();
const request = require('request');

// Show weather form
router.get('/', function(req, res) {
    res.render('weather.ejs', { weather: null, error: null });
});

router.post('/', function(req, res, next) {

    let city = req.body.city || "london";

    let apiKey = '66dddd52ac235b979378738be52e6f23';  
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {

        if (err) {
            next(err);
        } else {

          
            //old code

            // res.send(body)

            /*
            var weather = JSON.parse(body)
            var wmsg = 'It is '+ weather.main.temp + 
                ' degrees in '+ weather.name +
                '! <br> The humidity now is: ' + 
                weather.main.humidity;
            res.send (wmsg);
            */

        

            let weatherData = JSON.parse(body);

            if (weatherData.cod !== 200) {
                return res.render('weather.ejs', { weather: null, error: "City not found." });
            }

            let output = {
                city: weatherData.name,
                temp: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                wind: weatherData.wind.speed,
                description: weatherData.weather[0].description,
                clouds: weatherData.clouds.all
            };

            res.render('weather.ejs', {
                weather: output,
                error: null
            });
        }
    });

});

module.exports = router;
