import express from 'express'
import path from 'path'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()
const app = express()

const PORT = process.env.PORT ?? 3000
const __dirname = path.resolve()
app.use('/public', express.static(__dirname + '/public'))
app.use(express.json({limit: '1mb' }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

//receiving city name,
//decoding name to lat and long, 
//making API fetch to OpenWeather, 
//sending fetch response back on client
app.post('/api/find-city', async (request, response) => {
    const data = request.body;
    const API_key = process.env.WEATHER_API_KEY;
    try{
        const geocoder_url = `http://api.openweathermap.org/geo/1.0/direct?q=${data.city_name}&appid=${API_key}`
        const geocoder_response = await fetch(geocoder_url).then((response) =>{
            return response.json();
        });
        const daily_weather_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${geocoder_response[0].lat}&lon=${geocoder_response[0].lon}&exclude=current,minutely,hourly,alerts&appid=${API_key}`
        const current_weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${geocoder_response[0].lat}&lon=${geocoder_response[0].lon}&appid=${API_key}`
        const daily_response = await fetch(daily_weather_url).then((response) =>{
            return response.json();
        });
        const current_response = await fetch(current_weather_url).then((response) =>{
            return response.json();
        });
        const total_response ={current_response, daily_response}
        response.json(total_response)
    }
    catch(err){
        response.json(err)
    }
});

//receiving lat and long,
//making API fetch to OpenWeather,
//sending fetch response back on client
app.post('/api/geolocation', async (request, response) => {
    const data = request.body;
    const API_key = process.env.WEATHER_API_KEY;
    const daily_weather_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.long}&exclude=current,minutely,hourly,alerts&appid=${API_key}`
    const current_weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.long}&appid=${API_key}`
    const daily_response = await fetch(daily_weather_url).then((response) =>{
        return response.json();
    });
    const current_response = await fetch(current_weather_url).then((response) =>{
        return response.json();
    });
    const total_response ={current_response, daily_response}
    response.json(total_response)
});

app.listen(PORT, ()=>{
    console.log(`server has been started on port ${PORT}...`)
})

