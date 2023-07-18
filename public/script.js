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
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='22.56' x2='39.2' y1='21.96' y2='50.8' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23f3f7fe'/%3E%3Cstop offset='.45' stop-color='%23f3f7fe'/%3E%3Cstop offset='1' stop-color='%23deeafb'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23a)' stroke='%23e6effc' stroke-miterlimit='10' stroke-width='.5' d='M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z'%3E%3CanimateTransform attributeName='transform' dur='7s' repeatCount='indefinite' type='translate' values='-3 0; 3 0; -3 0'/%3E%3C/path%3E%3C/svg%3E"
    }
    else if (condition.includes("rain")) {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='b' x1='22.56' x2='39.2' y1='21.96' y2='50.8' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23f3f7fe'/%3E%3Cstop offset='.45' stop-color='%23f3f7fe'/%3E%3Cstop offset='1' stop-color='%23deeafb'/%3E%3C/linearGradient%3E%3ClinearGradient id='a' x1='22.53' x2='25.47' y1='42.95' y2='48.05' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%234286ee'/%3E%3Cstop offset='.45' stop-color='%234286ee'/%3E%3Cstop offset='1' stop-color='%230950bc'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' x1='29.53' x2='32.47' y1='42.95' y2='48.05' xlink:href='%23a'/%3E%3ClinearGradient id='d' x1='36.53' x2='39.47' y1='42.95' y2='48.05' xlink:href='%23a'/%3E%3C/defs%3E%3Cpath fill='url(%23b)' stroke='%23e6effc' stroke-miterlimit='10' stroke-width='.5' d='M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z'/%3E%3Cpath fill='none' stroke='url(%23a)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M24.39 43.03l-.78 4.94'%3E%3CanimateTransform attributeName='transform' dur='0.7s' repeatCount='indefinite' type='translate' values='1 -5; -2 10'/%3E%3Canimate attributeName='opacity' dur='0.7s' repeatCount='indefinite' values='0;1;1;0'/%3E%3C/path%3E%3Cpath fill='none' stroke='url(%23c)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M31.39 43.03l-.78 4.94'%3E%3CanimateTransform attributeName='transform' begin='-0.4s' dur='0.7s' repeatCount='indefinite' type='translate' values='1 -5; -2 10'/%3E%3Canimate attributeName='opacity' begin='-0.4s' dur='0.7s' repeatCount='indefinite' values='0;1;1;0'/%3E%3C/path%3E%3Cpath fill='none' stroke='url(%23d)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M38.39 43.03l-.78 4.94'%3E%3CanimateTransform attributeName='transform' begin='-0.2s' dur='0.7s' repeatCount='indefinite' type='translate' values='1 -5; -2 10'/%3E%3Canimate attributeName='opacity' begin='-0.2s' dur='0.7s' repeatCount='indefinite' values='0;1;1;0'/%3E%3C/path%3E%3C/svg%3E"
    }
    else if (condition.includes("clear" || "sun")) {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='26.75' x2='37.25' y1='22.91' y2='41.09' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23fbbf24'/%3E%3Cstop offset='.45' stop-color='%23fbbf24'/%3E%3Cstop offset='1' stop-color='%23f59e0b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='32' cy='32' r='10.5' fill='url(%23a)' stroke='%23f8af18' stroke-miterlimit='10' stroke-width='.5'/%3E%3Cpath fill='none' stroke='%23fbbf24' stroke-linecap='round' stroke-miterlimit='10' stroke-width='3' d='M32 15.71V9.5m0 45v-6.21m11.52-27.81l4.39-4.39M16.09 47.91l4.39-4.39m0-23l-4.39-4.39m31.82 31.78l-4.39-4.39M15.71 32H9.5m45 0h-6.21'%3E%3CanimateTransform attributeName='transform' dur='45s' repeatCount='indefinite' type='rotate' values='0 32 32; 360 32 32'/%3E%3C/path%3E%3C/svg%3E"
    }
    else if (condition.includes("snow")) {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='b' x1='22.56' x2='39.2' y1='21.96' y2='50.8' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23f3f7fe'/%3E%3Cstop offset='.45' stop-color='%23f3f7fe'/%3E%3Cstop offset='1' stop-color='%23deeafb'/%3E%3C/linearGradient%3E%3ClinearGradient id='a' x1='30.12' x2='31.88' y1='43.48' y2='46.52' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2386c3db'/%3E%3Cstop offset='.45' stop-color='%2386c3db'/%3E%3Cstop offset='1' stop-color='%235eafcf'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' x1='29.67' x2='32.33' y1='42.69' y2='47.31' xlink:href='%23a'/%3E%3ClinearGradient id='d' x1='23.12' x2='24.88' y1='43.48' y2='46.52' xlink:href='%23a'/%3E%3ClinearGradient id='e' x1='22.67' x2='25.33' y1='42.69' y2='47.31' xlink:href='%23a'/%3E%3ClinearGradient id='f' x1='37.12' x2='38.88' y1='43.48' y2='46.52' xlink:href='%23a'/%3E%3ClinearGradient id='g' x1='36.67' x2='39.33' y1='42.69' y2='47.31' xlink:href='%23a'/%3E%3C/defs%3E%3Cpath fill='url(%23b)' stroke='%23e6effc' stroke-miterlimit='10' stroke-width='.5' d='M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z'/%3E%3Cg%3E%3Ccircle cx='31' cy='45' r='1.25' fill='none' stroke='url(%23a)' stroke-miterlimit='10'/%3E%3Cpath fill='none' stroke='url(%23c)' stroke-linecap='round' stroke-miterlimit='10' d='M33.17 46.25l-1.09-.63m-2.16-1.24l-1.09-.63M31 42.5v1.25m0 3.75v-1.25m-1.08-.63l-1.09.63m4.34-2.5l-1.09.63'/%3E%3CanimateTransform additive='sum' attributeName='transform' dur='4s' repeatCount='indefinite' type='translate' values='-1 -6; 1 12'/%3E%3CanimateTransform additive='sum' attributeName='transform' dur='9s' repeatCount='indefinite' type='rotate' values='0 31 45; 360 31 45'/%3E%3Canimate attributeName='opacity' dur='4s' repeatCount='indefinite' values='0;1;1;1;0'/%3E%3C/g%3E%3Cg%3E%3Ccircle cx='24' cy='45' r='1.25' fill='none' stroke='url(%23d)' stroke-miterlimit='10'/%3E%3Cpath fill='none' stroke='url(%23e)' stroke-linecap='round' stroke-miterlimit='10' d='M26.17 46.25l-1.09-.63m-2.16-1.24l-1.09-.63M24 42.5v1.25m0 3.75v-1.25m-1.08-.63l-1.09.63m4.34-2.5l-1.09.63'/%3E%3CanimateTransform additive='sum' attributeName='transform' begin='-2s' dur='4s' repeatCount='indefinite' type='translate' values='1 -6; -1 12'/%3E%3CanimateTransform additive='sum' attributeName='transform' dur='9s' repeatCount='indefinite' type='rotate' values='0 24 45; 360 24 45'/%3E%3Canimate attributeName='opacity' begin='-2s' dur='4s' repeatCount='indefinite' values='0;1;1;1;0'/%3E%3C/g%3E%3Cg%3E%3Ccircle cx='38' cy='45' r='1.25' fill='none' stroke='url(%23f)' stroke-miterlimit='10'/%3E%3Cpath fill='none' stroke='url(%23g)' stroke-linecap='round' stroke-miterlimit='10' d='M40.17 46.25l-1.09-.63m-2.16-1.24l-1.09-.63M38 42.5v1.25m0 3.75v-1.25m-1.08-.63l-1.09.63m4.34-2.5l-1.09.63'/%3E%3CanimateTransform additive='sum' attributeName='transform' begin='-1s' dur='4s' repeatCount='indefinite' type='translate' values='1 -6; -1 12'/%3E%3CanimateTransform additive='sum' attributeName='transform' dur='9s' repeatCount='indefinite' type='rotate' values='0 38 45; 360 38 45'/%3E%3Canimate attributeName='opacity' begin='-1s' dur='4s' repeatCount='indefinite' values='0;1;1;1;0'/%3E%3C/g%3E%3C/svg%3E"
    }
    else if (condition.includes("storm")) {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='b' x1='22.56' x2='39.2' y1='21.96' y2='50.8' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23f3f7fe'/%3E%3Cstop offset='.45' stop-color='%23f3f7fe'/%3E%3Cstop offset='1' stop-color='%23deeafb'/%3E%3C/linearGradient%3E%3ClinearGradient id='a' x1='22.53' x2='25.47' y1='42.95' y2='48.05' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%234286ee'/%3E%3Cstop offset='.45' stop-color='%234286ee'/%3E%3Cstop offset='1' stop-color='%230950bc'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' x1='29.53' x2='32.47' y1='42.95' y2='48.05' xlink:href='%23a'/%3E%3ClinearGradient id='d' x1='36.53' x2='39.47' y1='42.95' y2='48.05' xlink:href='%23a'/%3E%3ClinearGradient id='e' x1='26.74' x2='35.76' y1='37.88' y2='53.52' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23f7b23b'/%3E%3Cstop offset='.45' stop-color='%23f7b23b'/%3E%3Cstop offset='1' stop-color='%23f59e0b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23b)' stroke='%23e6effc' stroke-miterlimit='10' stroke-width='.5' d='M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z'/%3E%3Cpath fill='none' stroke='url(%23a)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M24.39 43.03l-.78 4.94'%3E%3CanimateTransform attributeName='transform' dur='0.7s' repeatCount='indefinite' type='translate' values='1 -5; -2 10'/%3E%3Canimate attributeName='opacity' dur='0.7s' repeatCount='indefinite' values='0;1;1;0'/%3E%3C/path%3E%3Cpath fill='none' stroke='url(%23c)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M31.39 43.03l-.78 4.94'%3E%3CanimateTransform attributeName='transform' begin='-0.4s' dur='0.7s' repeatCount='indefinite' type='translate' values='1 -5; -2 10'/%3E%3Canimate attributeName='opacity' begin='-0.4s' dur='0.7s' repeatCount='indefinite' values='0;1;1;0'/%3E%3C/path%3E%3Cpath fill='none' stroke='url(%23d)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M38.39 43.03l-.78 4.94'%3E%3CanimateTransform attributeName='transform' begin='-0.2s' dur='0.7s' repeatCount='indefinite' type='translate' values='1 -5; -2 10'/%3E%3Canimate attributeName='opacity' begin='-0.2s' dur='0.7s' repeatCount='indefinite' values='0;1;1;0'/%3E%3C/path%3E%3Cpath fill='url(%23e)' stroke='%23f6a823' stroke-miterlimit='10' stroke-width='.5' d='M30 36l-4 12h4l-2 10 10-14h-6l4-8h-6z'%3E%3Canimate attributeName='opacity' dur='2s' repeatCount='indefinite' values='1; 1; 1; 1; 1; 1; 0.1; 1; 0.1; 1; 1; 0.1; 1; 0.1; 1'/%3E%3C/path%3E%3C/svg%3E"
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