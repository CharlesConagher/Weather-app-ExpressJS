async function downloadData(url){
   let response = await fetch(url)
   if(response.ok){
       let jsonData = response.json()
       console.log(jsonData)
       return jsonData
   } else {
        alert('Error' + response.status)
   }
}

function start(url){
    downloadData(url).then(data =>{
        render(data)
    })
}

document.querySelector('.input__button').addEventListener('click',getCityFromInput) 
function getCityFromInput(){
    let inputCity = document.querySelector('.input__city').value
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&appid=61258af22950f7dfdca86ef3a1babe8c`
    start(url)
}
  
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + '<br> ' + hour + ':00'  ;
  return time;
}

function render(data){
    renderCurrent(data)
    renderDetails(data)
    renderForecast(data)
}

function renderCurrent(data){
    document.querySelector('.current__city').textContent = data.city.name
    document.querySelector('.current__temp').innerHTML = Math.round(data.list[0].main.temp - 273) + ('&deg;') + ('C')
    document.querySelector('.current__desc').textContent = data.list[0].weather[0].description
}

function renderDetails(data){
    document.querySelector('.feels-like').innerHTML = Math.round(data.list[0].main.feels_like - 273)  + ('&deg;') + ('C')
    document.querySelector('.pressure').innerHTML = (data.list[0].main.pressure/1.33).toFixed() + ('m.m')
    document.querySelector('.humidity').innerHTML = data.list[0].main.humidity + ('%')
    document.querySelector('.wind').innerHTML = data.list[0].wind.speed + ('m/s')
}
 
function renderForecast(data){
    let forecastDataContainer = document.querySelector('.forecast');
    let forecasts = '';
    
    for(let i = 0; i < 6; i++) {
        let item = data.list[i];
        let temp = Math.round(item.main.temp - 273) +('&deg;');
        let desc = item.weather[0].description
        let hours = timeConverter(item.dt)

        let template = `<div class="forecast__item">
                        <div class="forecast__time">${hours}</div>
                        <div class="forecast__desc">${desc}</div>
                        <div class="forecast__temperature">${temp}</div>
                        </div>`;
        forecasts += template;
    }
    forecastDataContainer.innerHTML = forecasts;
}
