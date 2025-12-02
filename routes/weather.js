const express = require('express');
const router = express.Router();
const request = require('request');

// Your API key
const API_KEY = "66dddd52ac235b979378738be52e6f23";

// GET /weather
router.get('/', (req, res) => {
    const city = req.query.city || "London";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    request({ url, json: true }, (err, response, body) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error contacting weather API");
        }

        if (body.cod !== 200) {
            return res.status(500).send("Weather API error: " + body.message);
        }

        // render weather.ejs
        res.render('weather.ejs', { weather: body, city });
    });
});

module.exports = router;
