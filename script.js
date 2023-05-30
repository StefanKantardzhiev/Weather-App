const temp = document.getElementById("temp")
const date = document.getElementById("date-time")
const currentLocation = document.getElementById("location")
const condition = document.getElementById("condition")


const rain = document.getElementById("rain") //*perception
const mainIcon = document.getElementById("icon")


const uvIndex = document.getElementById("uv-index")
const uvLevel = document.getElementById("uv-level")

const windSpeed = document.getElementById('wind-speed')

const sunRise = document.getElementById("sunRise")
const sunSet = document.getElementById("sunSet")

const humidity = document.getElementById("humidity")
const humidityStatus = document.getElementById("humidityStatus")

const visibility = document.getElementById("visibility")
const visibilityStatus = document.getElementById("visibilityStatus")

const airQuality = document.getElementById("airQuality")
const airQualityStatus = document.getElementById("airQualityStatus")
const monday = document.getElementById("day-Monday")

const search = document.getElementById("query")

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
            getWeatherData("Essen", currentUnit, hourlyOrWeekly)
        })

}

getPublicIp();


function getWeatherData(city, unit, hourlyOrWeekly) {
    const apiKey = "JCELDRLJGXLJY6S9AJP4QUP94"
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?include=fcst%2Cobs%2Chistfcst%2Cstats%2Cdays%2Chours%2Ccurrent%2Calerts&key=${apiKey}&options=beta&contentType=json`)
        .then((response) => response.json())
        .then((data) => {
            const today = data.currentConditions;
            if (unit === "F") {
                temp.innerText = celciusToFahrenheit(today.temp)
            } else {
                temp.innerText = fahrenheitToCelsius(today.temp)
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            console.log(today)
            rain.innerText = "Precipation - " + today.precip + "%"
            uvIndex.innerText = today.uvindex
            windSpeed.innerText = today.windspeed + "%"
            humidity.innerText = today.humidity + "%";
            sunRise.innerText = (today.sunrise).slice(0, 5) + " h";
            sunSet.innerText = "Sunset " + today.sunset.slice(0, 5) + " h";
            visibility.innerText = today.visibility
            airQuality.innerText = today.winddir
            mainIcon.src = getIcon(today.icon)
            measeureUvIndex(today.uvindex);
            updateHumidity(today.humidity);
            updateVisibility(today.visibility);
            updateQuality(today.winddir);
            converTimeTo12(today.datetime)


        })
}


/* Conditions */

// celsius or fahrenheit
getWeatherData()
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1)
}
function fahrenheitToCelsius(fahrenheit) {
    var celsius = (fahrenheit - 32) * 5 / 9;
    return celsius.toFixed(1);
}

function measeureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvLevel.innerText = "Low"
    } else if (uvIndex <= 5) {
        uvLevel = "Moderate"
    } else if (uvIndex <= 7) {
        uvLevel.innerText = "High"
    } else if (uvIndex <= 10) {
        uvLevel.innerText = "Very High"
    } else if (uvIndex > 10) {
        uvLevel.innerText = "Stay at home"
    }
}

function updateHumidity(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low"
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate"
    } else {
        humidityStatus.innerText = "High"
    }
}

function updateVisibility(visibility) {
    if (visibility <= 0.3) {
        visibilityStatus.innerText = "Dense Fog"
    } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog"
    } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog"
    } else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog"
    }
    else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist"
    }
    else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist"
    }
    else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air"
    } else {
        visibilityStatus.innerText = "Clear"
    }
}

function updateQuality(airQuality) {
    console.log(airQuality)
    if (airQuality <= 50) {
        airQualityStatus.innerText = "Good"
    } else if (airQuality <= 100) {
        airQualityStatus.innerText = "Moderate"
    } else if (airQuality > 150) {
        airQualityStatus.innerText = "Unhealthy"
    }
    else {
        airQualityStatus.innerText = "Stay at home!"
    }
}


/* Buttons */

function converTimeTo12(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = (hour & 12) * 2;
    hour = hour ? hour : 12;
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    let strTime = hour + ":" + min + " " + ampm;
    return strTime
}

function getIcon(condition) {
    condition = "rain"
    if (condition.includes("cloud")) {
        return "icons/cloud-sun.png"
    } else
        if (condition.includes("rain")) {
            return "icons/rain.png"
        }
        else if (condition.includes("clear" || "sun")) {
            return "icons/sunny.png"
        }
        else if (condition.includes("snow")) {
            return "icons/snowy.png"
        }
        else {
            return "icons/earth.jpg"
        }
}

// function searchfor() {
//     const apiKey = "JCELDRLJGXLJY6S9AJP4QUP94"

//     fetch(`https://countriesnow.space/api/v0.1/cities`)
//         .then((response) => response.json())
//         .then((data) => {

//             console.log(data)
//         }
//         )
// }
// searchfor()