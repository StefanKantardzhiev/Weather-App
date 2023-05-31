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
const searchForm = document.getElementById("search")

const celsiusBtn = document.getElementById("celcius")
const fahrenheitBtn = document.getElementById("fahrenheit")

const tempUnit = document.querySelectorAll(".temp-unit")
const weatherCards = document.getElementById("cards")

let currentCity = '';
let currentUnit = 'c';
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
    fetch("http://www.geoplugin.net/json.gp/")
        .then((response) => response.json())
        .then((data) => {
            currentCity = data.geoplugin_city
            getWeatherData(data.geoplugin_city, currentUnit, hourlyOrWeekly)
        })

}

getPublicIp();




function getWeatherData(city, unit, hourlyOrWeekly) {
    const apiKey = "JCELDRLJGXLJY6S9AJP4QUP94"
    
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?include=fcst%2Cobs%2Chistfcst%2Cstats%2Cdays%2Chours%2Ccurrent%2Calerts&key=${apiKey}&options=beta&contentType=json`)
        .then((response) => response.json())
        .then((data) => {
            const today = data.currentConditions;
            
            if (unit === "c") {
                temp.innerText = fahrenheitToCelsius(today.temp)
            } else if (unit === "f") {
                temp.innerText = celciusToFahrenheit(today.temp)
            }

            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;

            rain.innerText = "Precipation - " + today.precip + "%"
            uvIndex.innerText = today.uvindex
            windSpeed.innerText = today.windspeed + "%"
            humidity.innerText = today.humidity + "%";
            sunRise.innerText = (today.sunrise).slice(0, 5) + " h";
            sunSet.innerText = "Sunset " + today.sunset.slice(0, 5) + " h";
            visibility.innerText = today.visibility
            airQuality.innerText = today.winddir
            mainIcon.src = getIcon(today.icon)
            if (hourlyOrWeekly === "hourly") {
                console.log(unit)
                updateForecast(data.days[0].hours, unit, "day")
            } else {
                updateForecast(data.days, unit, "week")
            }
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

    if (condition.includes("cloud")) {
        return "https://i.ibb.co/9cGHp0P/cloudy.png"
    } else
        if (condition.includes("rain")) {
            return "https://i.ibb.co/ZBKRkNW/rain.png"
        }
        else if (condition.includes("clear" || "sun")) {
            return "https://i.ibb.co/2S1NSfg/sunny.png"
        }
        else if (condition.includes("snow")) {
            return "https://i.ibb.co/dD1T937/snowy.png"
        }
        else if (condition.includes("storm")) {
            return "https://i.ibb.co/WHf8nYq/storm.png"
        }
        else {
            return "https://i.ibb.co/Ch8DLHJ/umbrella.png"
        }
}


function getDayName(date) {
    let day = new Date(date)
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return days[day.getDay()]
}

function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour < 12) {
        hour = hour - 12
        return `${hour} : ${min} PM`
    } else {
        hour = hour - 12
        return `0${hour} : ${min} A`
    }

}

function updateForecast(data, unit, type) {
    weatherCards.innerHTML = '';

    let day = 0;
    let numCards = 0;

    if (type === 'day') {
        numCards = 24
    } else {
        numCards = 7
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card")
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit === "c") {
            dayTemp = fahrenheitToCelsius(data[day].temp)
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition)
        let tempUnit = 'c';
        if (unit === 'f') {
            tempUnit = 'f'
        }
        console.log('test')
        card.innerHTML = `
        
        <h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
            <img src="${iconSrc}" alt="" srcset="">
        </div>
        <div class="day-temp">
            <h2 class="temperature">${dayTemp}</h2>
            <span class="temp-unit">°${tempUnit}</span>
        </div>
    `;
        weatherCards.appendChild(card)
        day++
    }

}
















searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let location = search.value;
    if (location) {
        currentCity = location
        getWeatherData(currentCity, currentUnit, hourlyOrWeekly)
    }
})

celsiusBtn.addEventListener("click", () => {
    changeUnit("c")
})
fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f")
})


function changeUnit(unit) {
    if (currentUnit != unit) {
        currentUnit = unit;
        {
            tempUnit.forEach((element) => {
                element.innerText = `${unit.toUpperCase()}`
            });
            if (unit === "c") {
                celsiusBtn.classList.add("active")
                fahrenheitBtn.classList.remove("active")
            } else {
                celsiusBtn.classList.remove("active")
                fahrenheitBtn.classList.add("active")
            }
            getWeatherData(currentCity, currentUnit, hourlyOrWeekly)
        }
    }
}