const temp = document.getElementById("temp")
const date = document.getElementById("date-time")


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
    fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/world?unitGroup=metric&key=${apiKey}&contentType=json")

}

getWeatherData()