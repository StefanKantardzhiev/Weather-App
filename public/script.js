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


const hourlyBtn = document.getElementById("hourly")
const weeklyBtn = document.getElementById("weekly")

let currentCity = 'Essen';
let currentUnit = 'c';
let hourlyOrWeekly = " ";


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
    return (`${dayString} / ${hour}:${minute} h`)
}

date.innerText = getDateTime()
// setInterval(() => {
//     date.innerText = getDateTime()
// }, 1000)


function getPublicIp() {
    fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data) => {
            currentCity = data.city
            getWeatherData(currentCity, currentUnit, hourlyOrWeekly)
        })
        .catch((err) => {
            currentCity = "Essen"
            getWeatherData(currentCity, currentUnit, hourlyOrWeekly)

        })
}

getPublicIp();




function getWeatherData(city, unit, hourlyOrWeekly) {
    const apiKey = "JCELDRLJGXLJY6S9AJP4QUP94"
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`)
        .then((response) => response.json())
        .then((data) => {
            const today = data.currentConditions;

            if (unit === "c") {
                temp.innerText = today.temp + ` °C`
            } else if (unit === "f") {
                temp.innerText = celciusToFahrenheit(today.temp)
            }

            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;

            rain.innerText = "Precipitation - " + today.precipprob + "%";
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed + " km/h"
            humidity.innerText = today.humidity + "%";
            sunRise.innerText = (today.sunrise).slice(0, 5) + " h";
            sunSet.innerText = "Sunset " + today.sunset.slice(0, 5) + " h";
            visibility.innerText = today.visibility
            mainIcon.src = getIcon(today.icon);
            if (hourlyOrWeekly === "hourly") {
                updateForecast(data.days[0].hours, unit, "hourly")
            } else {
                updateForecast(data.days, unit, "weekly")
            }
            measeureUvIndex(today.uvindex);
            updateHumidity(today.humidity);
            updateVisibility(today.visibility);
            // updateQuality(today.winddir);
            getHour(today.datetime);
            converTimeTo12(today.datetime);
        }).catch((err) => {
            return err
        });
}


/* Conditions */

// celsius or fahrenheit
// getWeatherData()
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1) + ` °F`
}
function fahrenheitToCelsius(fahrenheit) {
    let celsius = (fahrenheit - 32) * 5 / 9;
    return celsius.toFixed(1) + ` °C`;
}




function measeureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvLevel.innerText = "Low"
    } else if (uvIndex <= 5) {
        uvLevel = "Moderate"
    } else if (uvIndex <= 8) {
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
        visibilityStatus.innerText = "Clear"
    } else if (visibility > 10.8) {
        visibilityStatus.innerText = "Clear"
    }
}

function updateQuality(airQuality) {

    if (airQuality <= 50) {
        airQualityStatus.innerText = "Good"
    } else if (airQuality <= 200) {
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

function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];

    if (hour > 17) {
        getIcon(condition.includes("clear || sun") = () => {
            return "../../images/clear-night.svg"
        }
        )
    }


    return `${hour} : ${min} h`

}
function getIcon(condition) {

    if (condition.includes("cloud")) {
        return '../../images/cloudy.svg'
    } else
        if (condition.includes("rain")) {
            return "../../images/rain.svg"
        }
        else if (condition.includes("clear" || "sun")) {
            return "../../images/clear-day.svg"
        }
        else if (condition.includes("snow")) {
            return "../../images/snow.svg"
        }
        else if (condition.includes("storm")) {
            return "../../images/thunderstorms-rain.svg"
        }
        else {
            return "https://i.ibb.co/Wksg10D/icons8-barometer.gif"
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
hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly")
});
weeklyBtn.addEventListener("click", () => {
    changeTimeSpan("weekly")
})

function changeTimeSpan(unit) {
    if (hourlyOrWeekly != unit) {
        hourlyOrWeekly = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add('active')
            weeklyBtn.classList.remove('active')
        } else {
            hourlyBtn.classList.remove('active')
            weeklyBtn.classList.add('active')
        }
    }
    getWeatherData(currentCity, currentUnit, hourlyOrWeekly)
}


function updateForecast(data, unit, type) {
    weatherCards.innerHTML = '';

    let day = 0;
    let numCards = 0;

    if (type === 'hourly') {
        numCards = 24
    } else {
        numCards = 7
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card")
        let dayName = getHour(data[day].datetime);
        if (type === "weekly") {
            dayName = getDayName(data[day].datetime);
        } else {
            dayName = getHour(data[day].datetime);
        }
        let dayTemp = data[day].temp;

        if (unit === "c") {
            dayTemp = data[day].temp + ` °C`
        } else if (unit === 'f') {
            dayTemp = celciusToFahrenheit(data[day].temp)
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition)
        let tempUnit = 'c';
        if (unit === 'f') {
            tempUnit = 'f'
        }
        card.innerHTML = `
        
        <h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
            <img src="${iconSrc}" alt="" srcset="">
        </div>
        <div class="day-temp">
            <h2 class="temperature">${dayTemp}</h2>
            <span class="temp-unit"></span>
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
            if (unit === "c") {
                celsiusBtn.classList.add("active")
                fahrenheitBtn.classList.remove("active")
            } else {
                celsiusBtn.classList.remove("active")
                fahrenheitBtn.classList.add("active")
            }

        }
        getWeatherData(currentCity, currentUnit, hourlyOrWeekly)
    }
}