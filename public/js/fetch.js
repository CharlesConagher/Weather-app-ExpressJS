//UNIX time converter
function timeConverter(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    // let hour = a.getHours();
    // let min = a.getMinutes();
    // let sec = a.getSeconds();
    return date + ' ' + month;
 }

// Weather forecast search by city name
document.querySelector('.input__button').addEventListener('click',findCity)
async function findCity(){
    const city_name = document.getElementById('input__city').value
    const city_data = {city_name}
    const options = { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(city_data)
    };
    const response_data = await fetch('/api/find-city', options)
    .then(response => response.json())
    try{
        document.getElementById('lat').textContent = response_data.current_response.coord.lat.toFixed(2); //showing lat and long on client
        document.getElementById('long').textContent = response_data.current_response.coord.lon.toFixed(2);
        document.querySelector('.weather__current').classList.remove("hidden")
        document.querySelector('.weather__details').classList.remove("hidden")
        document.querySelector('.forecast').classList.remove("hidden")
        start(response_data) //launching render of weather data on client
    }
     catch(err){
        alert(
            `We cannot process your request!
             Possible reasons:
                *You misspelled a city name;
                *City with this name does not exist;
                *You didn't write the name of the city;`)
    }     
} 

//Weather forecast search by geolocation
document.querySelector('.geolocation__button').addEventListener('click',getGeolocation)
function getGeolocation(){
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(async position => { //getting lat and long from browser navigator
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            document.getElementById('lat').textContent = lat.toFixed(2); //showing lat and long on client
            document.getElementById('long').textContent = long.toFixed(2);
            const geo_data = {lat, long};
            const options = { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(geo_data)
            };
            const response_data = await fetch('/api/geolocation', options).then((response) => { //sending and receiving weather data from server
                return response.json();
            })
            document.querySelector('.weather__current').classList.remove("hidden")
            document.querySelector('.weather__details').classList.remove("hidden")
            document.querySelector('.forecast').classList.remove("hidden")
            start(response_data) //launching render of weather data on client
        })
    } else {
        console.log('geolocation is not available')
    }
}

//Rendering weather data on client
function start(data){
    renderCurrent(data)
    renderDetails(data)
    renderForecast(data)
}
 
function renderCurrent(data){
    document.querySelector('.weather__current__city').textContent = data.current_response.name
    document.querySelector('.weather__current__temp').innerHTML = Math.round(data.current_response.main.temp - 273) + ('&deg;') + ('C')
    document.querySelector('.weather__current__desc').textContent = data.current_response.weather[0].description
    document.querySelector('.weather__current__icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.current_response.weather[0].icon}@2x.png" alt="weather-icon">`
    document.body.style.backgroundImage = `url(https://source.unsplash.com/1920x1080/?${data.current_response.name})`
}
 
function renderDetails(data){
    document.querySelector('.feels-like').innerHTML = Math.round(data.current_response.main.feels_like - 273)  + ('&deg;') + ('C')
    document.querySelector('.pressure').innerHTML = (data.current_response.main.pressure/1.33).toFixed() + ('m.m')
    document.querySelector('.humidity').innerHTML = data.current_response.main.humidity + ('%')
    document.querySelector('.wind').innerHTML = data.current_response.wind.speed + ('m/s')
}
  
function renderForecast(data){
     let forecastDataContainer = document.querySelector('.forecast');
     let forecasts = '';
     
     for(let i = 0; i < 6; i++) {
        let item = data.daily_response.daily[i];
        let time = timeConverter(item.dt);
        let icon = document.querySelector('.forecast__icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather-icon">`
        let desc = item.weather[0].description;
        let temp = Math.round(item.temp.day - 273) +('&deg;');
        if(i === 0){
            time = 'today'
        }
        let template = `<div class="forecast__item">
                            <div class="forecast__time">${time}</div>
                            <div class="forecast__icon">${icon}</div>
                            <div class="forecast__desc">${desc}</div>
                            <div class="forecast__temp">${temp}</div>
                        </div>`;
        forecasts += template;
    }
    forecastDataContainer.innerHTML = forecasts;
}
