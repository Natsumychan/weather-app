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
let searchCity= document.querySelector("#formGroupExampleInput");
let cityName= document.querySelector("#city")
searchCity.addEventListener("keyup",event => {
	if (event.keyCode === 13){
      citySearching()
	}
});

function citySearching(){
  let citySelected= searchCity.value
  cityName.innerHTML= citySelected
  getInfoByCityName(citySelected)
};

//Get the weather info from Open Weather Map by city name
function getInfoByCityName(city){
  let apiKey= "te60b41a5ebo3808074c9edaf83940fc"
  let apiUrl=`https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`
  axios.get(apiUrl).then(printWeatherInfo)
};

//Display weather information
let metricInfo;
let mainTemperature=document.querySelector("#main-temperature");

function printWeatherInfo(response){
  let weatherDescription= response.data.condition.icon_url
  let celsius= document.querySelector("#celsius")
  let fahrenheit= document.querySelector("#fahrenheit")
  let windSpeed= document.querySelector("#wind-speed")
  let humidity= document.querySelector("#humidity")
  
  let humidityInfo= Math.round(response.data.temperature.humidity)
  let windSpeedInfo= Math.round(response.data.wind.speed)
  metricInfo= Math.round(response.data.temperature.current)
  
  celsius.addEventListener("click",changeCelsius)
  fahrenheit.addEventListener("click",changeFahrenheit)
  mainTemperature.innerHTML=`${metricInfo} °C`
  windSpeed.innerHTML=`Wind: ${windSpeedInfo}Km/H` 
  humidity.innerHTML=`Humidity: ${humidityInfo}% | `
  weatherImage(weatherDescription)
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
}

function changeFahrenheit(event){
  event.preventDefault()
  let fahrenheitConvertion= Math.round((metricInfo* 9/5)+32)
  mainTemperature.innerHTML= `${fahrenheitConvertion} °F`
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
let fetchCity
function getInfoByCoordinates(latitude,longitude){
  let apiUrlCoords=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
  axios.get(apiUrlCoords).then(searchCityByCoords)
};

function searchCityByCoords(response){
  fetchCity= response.data.name
  cityName.innerHTML= fetchCity
  getInfoByCityName(fetchCity)
}

getInfoByCityName("Sacramento")