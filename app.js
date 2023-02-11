require('dotenv').config();
const express = require("express");
const http = require('http');

const app = express();

const apiKey = process.env.API_KEY;

const cities = [
  'London',
  'Paris',
  'New York City',
  'New Delhi',
  'Berlin',
  'San Francisco',
  'Mumbai',
  'Auckland',
  'Milan',
  'Shanghai', 
  'Seoul',
  'Sao Paulo',
  'Bangalore',
  'Sydney',
  'Zurich',
  'Munich',
  'Los Angeles',
  'Manchester',
  'Tokyo',
  'Kuala Lumpur',
  'Abu Dhabi',
  'Dubai',
  'Boston',
  'Johannesburg',
  'Abidjan',
  'Vancouver',
  'Buenos Aires',
  'Bogota',
  'Rio de Janiero',
  'Osaka'
];

app.get('/weather/:pageNum', (req, res) => {
  const pageNum = req.params.pageNum;
  const startIndex = (pageNum - 1) * 10;
  const endIndex = startIndex + 10;


  // Array to store the weather information for each city
  const weatherData = [];

  // Loop through each city and get its weather information
  for (let i = 0; i < cities.length; i++) {
    const request = http.get(`http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=${apiKey}&units=metric`, response => {
      let data = '';
      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', () => {
        const weather = JSON.parse(data);
        if (weather.main && weather.main.temp) {
          weatherData.push({
            city: weather.name,
            temperature: weather.main.temp,
            weather: weather.weather[0].description
          });
          console.log(weatherData);
        } else {
          console.error(`No temperature data found for city: ${cities[i].name}`);
        }

        if (weatherData.length === endIndex - startIndex) {
          // When weather information has been fetched for all cities, send the response
          res.json({
            success: true,
            data: weatherData
          });
        }
      });
    });

    request.on('error', error => {
      console.error(error);
      res.json({
        success: false,
        message: 'Failed to get weather information.'
      });
    });

    request.end();
  }
});


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
})


app.listen(3000, () => {
  console.log('Weather API running on http://localhost:3000');
});