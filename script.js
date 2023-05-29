const temp = document.getElementById("temp")
const date = document.getElementById("date-time")
const currentLocation = document.getElementById("location")
const condition = document.getElementById("condition")
const rain = document.getElementById("rain")
const mainIcon = document.getElementById("icon")

const windSpeed = document.getElementById('wind-speed')

const sunRise = document.querySelector("sunRise")
const sunSet = document.querySelector("sunSet")

const humidity = document.querySelector("humidity")
const humidityStatus = document.querySelector("humidityStatus")

const visibility = document.querySelector("visibility")
const visibilityStatus = document.querySelector("visibilityStatus")

const airQuality = document.querySelector("airQuality")
const airQualityStatus = document.querySelector("airQualityStatus")



let currentCity = '';
let currentUnit = '';
let hourlyOrWeekly = "Week"


// Update Date Time

function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes(),
        second = now.getSeconds()
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    // 12 hoour -> 
    //hour = hour % 12;


    if (hour < 10) {
        hour = "0" + hour
    }
    if (minute < 10) {
        minute = "0" + minute
    }
    if (second < 10) {
        second = "0" + second
    }
    let dayString = days[now.getDay()];
    return (`${dayString} / ${hour}:${minute}:${second}`)
}

date.innerText = getDateTime()
setInterval(() => {
    date.innerText = getDateTime()
}, 1000)


function getPublicIp() {
    fetch("https://geolocation-db.com/json/")
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            currentCity = data.currentCity;
        })
}

getPublicIp();


function getWeatherData(city, unit, hourlyOrWeekly) {
    const apiKey = "JCELDRLJGXLJY6S9AJP4QUP94"
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?elements=datetime%2CdatetimeEpoch%2Ctemp%2Ctempmax%2Ctempmin%2Cprecip%2Cwindspeed%2Cwindgust%2Cfeelslike%2Cfeelslikemax%2Cfeelslikemin%2Cpressure%2Cstations%2Cdegreedays%2Caccdegreedays&include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${apiKey}&options=preview&contentType=json`)
    .then((response)=> response.json())
    .then((data)=>{
        let today = data.currentConditions;
        if(unit === "c"){
            temp.innerText = today.temp
        }else{
            temp.innerText = celciusToFahrenheit(today.temp)
        }
        currentLocation.innerText = data.resolvedAddress
        CSSConditionRule.innerText = today.conditions
    })
}


function celciusToFahrenheit(temp){
    return((temp*9)/5 +32).toFixed(1)
}