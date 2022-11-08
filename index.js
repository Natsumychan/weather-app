//Global variable
const form= document.querySelector("#search-form")
const cityInputElement=document.querySelector("#city-input")
const celsius= document.querySelector("#celsius")
const fahrenheit= document.querySelector("#fahrenheit")
const cityName= document.querySelector("#city")

let citySelected="La Ceja"

//Date information
function digitalClock(){
  let nowDate= new Date()
  let days= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  let day= days[nowDate.getDay()]
  let hour= nowDate.getHours()
  let minutes= nowDate.getMinutes()
  let tempH=((hour < 10) ? '0' : '') + hour;
  let tempMin=((minutes < 10) ? ':0' : ':') + minutes;
  let currentTime= document.querySelector("#current-time")
  currentTime.innerHTML= `${day} ${tempH}${tempMin}`
  setTimeout("digitalClock()",500)
};

//Search city
form.addEventListener("submit",handleSubmit)

function handleSubmit(event){
    event.preventDefault()
    citySearching()
}

function citySearching(){
  citySelected= cityInputElement.value
  cityName.innerHTML= citySelected
  getInfoByCityName(citySelected)
  searchCityForecast(citySelected)
};

//Get the weather info from Open Weather Map by city name
let apiKey= "te60b41a5ebo3808074c9edaf83940fc"
function getInfoByCityName(city){
  let apiUrl=`https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`
  axios.get(apiUrl).then(printWeatherInfo)
};

//Display weather information
let metricInfo;
let mainTemperature=document.querySelector("#main-temperature");

function printWeatherInfo(response){
  let weatherDescription= response.data.condition.icon_url
  let windSpeed= document.querySelector("#wind-speed")
  let humidity= document.querySelector("#humidity")
  const weatherDescriptionElement= document.querySelector("#weather-description")
  
  let humidityInfo= Math.round(response.data.temperature.humidity)
  let windSpeedInfo= Math.round(response.data.wind.speed)
  metricInfo= Math.round(response.data.temperature.current)
  
  weatherDescriptionElement.innerText= response.data.condition.description
  celsius.addEventListener("click",changeCelsius)
  fahrenheit.addEventListener("click",changeFahrenheit)
  mainTemperature.innerHTML=`${metricInfo} °C`
  windSpeed.innerHTML=`Wind: ${windSpeedInfo} m/s` 
  humidity.innerHTML=`Humidity: ${humidityInfo}% | `
  weatherImage(weatherDescription)
}

//search city forecast
function searchCityForecast(city){
    let apiUrl=`https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`
    axios.get(apiUrl).then(displayForecast)
}

//Create HTML elements to display forecast
function displayForecast(response){ 
  let days=response.data.daily
    let forecastElement= document.querySelector("#forecast")
    let forecastHTML=`<div class="row justify-content-evenly g-4">`
    
    days.forEach(function (day, index){
        if(index<6){
        forecastHTML= forecastHTML+`
         <div class="col-6 card bg-dark text-white card-forecast">
            <h5 class="card-title title-weekD">
              ${displayDay(day.time*1000)}
            </h5>
            <img src=${day.condition.icon_url} alt="${day.condition.description}" style="width: 3rem; height: 3.5rem;">
            <p class="card-text text-week"> 
              <span class="forecast-max">
                ${Math.round(day.temperature.maximum)}      
              </span>
              <span class="forecast-min">
                ${Math.round(day.temperature.minimum)}
              </span>
            </p>
          </div>
        `}
    })
    forecastElement.innerHTML= forecastHTML +`</div>`
}

//display forecast day
function displayDay(dayStamp){
    let days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    let date = new Date(dayStamp)
    let dayForecast= days[date.getDay()]
    return dayForecast
    
}

//Change weather Image
function weatherImage(weatherDescription){
  const weatherImg= document.querySelector("#main-img")
  weatherImg.src= weatherDescription
}

//Change temperature
function changeCelsius(event){
  event.preventDefault()
  mainTemperature.innerHTML= `${metricInfo} °C`

  celsius.classList.remove("active")
  fahrenheit.classList.add("active")
  searchCityForecast(citySelected)
}

function changeFahrenheit(event){
  event.preventDefault()
  let fahrenheitConvertion= Math.round((metricInfo* 9/5)+32)
  mainTemperature.innerHTML= `${fahrenheitConvertion} °F`

  celsius.classList.add("active")
  fahrenheit.classList.remove("active")

  searchForecastImperial()
}

function searchForecastImperial(){
    let apiUrl=`https://api.shecodes.io/weather/v1/forecast?query=${citySelected}&key=${apiKey}&units=imperial`
    axios.get(apiUrl).then(displayForecast)
}

//Set current location info
let buttonCurrentLocation= document.querySelector(".btn-danger")
buttonCurrentLocation.addEventListener("click",allowPosition)

function allowPosition(){
  navigator.geolocation.getCurrentPosition(showCoordinates)
}

function showCoordinates(position){
  let latitude= position.coords.latitude
  let longitude= position.coords.longitude
  getInfoByCoordinates(latitude,longitude)
}

//Get city's name by coordinates
function getInfoByCoordinates(latitude,longitude){
  let apiUrlCoords=`https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}`
  axios.get(apiUrlCoords).then(searchCityByCoords)
};

function searchCityByCoords(response){
  citySelected= response.data.city
  cityName.innerText= citySelected
  getInfoByCityName(citySelected)
  searchCityForecast(citySelected)
}

//Default information
getInfoByCityName(citySelected)
searchCityForecast(citySelected)
cityName.innerHTML= citySelected