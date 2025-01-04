// Weather API Configuration
const weatherApi = {
  key: "23a600c3bfddf6241de06d609834e1cf", // Replace with your OpenWeatherMap API key
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

// Event listener for keypress of "Enter"
let searchInputBox = document.getElementById("input-box");
searchInputBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    getWeatherReport(searchInputBox.value);
  }
});

// Fetch weather report
function getWeatherReport(city) {
  const url = `${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`; // Construct the API URL
  fetch(url)
    .then((response) => response.json())
    .then((weather) => {
      if (weather.cod === "400") {
        swal("Empty Input", "Please enter a city", "error");
        reset();
      } else if (weather.cod === "404") {
        swal("City Not Found", "Please enter a valid city name", "warning");
        reset();
      } else if (weather.cod === 200) {
        // Only call showWeatherReport for valid responses
        showWeatherReport(weather);
      } else {
        swal("Error", `Unexpected response: ${weather.message}`, "error");
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      swal("Error", "Failed to fetch weather data. Please try again.", "error");
    });
}

// Display the weather report
function showWeatherReport(weather) {
  if (!weather || !weather.sys || !weather.main || !weather.weather || !weather.weather[0]) {
    console.error("Incomplete weather data:", weather);
    swal("Error", "Received incomplete weather data. Please try again.", "error");
    return;
  }

  let op = document.getElementById("weather-body");
  op.style.display = "block";
  let todayDate = new Date();

  op.innerHTML = `
    <div class="location-details">
      <div class="city">${weather.name}, ${weather.sys.country}</div>
      <div class="date">${dateManage(todayDate)}</div>
    </div>
    <div class="weather-status">
      <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>
      <div class="weather">${weather.weather[0].main} <i class="${getIconClass(weather.weather[0].main)}"></i></div>
      <div class="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)</div>
      <div>Updated as of ${getTime(todayDate)}</div>
    </div>
    <hr>
    <div class="day-details">
      <div class="basic">
        Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}%<br>
        Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH
      </div>
    </div>
  `;
  changeBg(weather.weather[0].main);
  reset();
}

// Get formatted time
function getTime(todayDate) {
  let hour = addZero(todayDate.getHours());
  let minute = addZero(todayDate.getMinutes());
  return `${hour}:${minute}`;
}

// Format date
function dateManage(dateArg) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];
  const year = dateArg.getFullYear();
  const month = months[dateArg.getMonth()];
  const date = dateArg.getDate();
  const day = days[dateArg.getDay()];
  return `${date} ${month} (${day}), ${year}`;
}

// Change background dynamically based on weather status
function changeBg(status) {
  const bgImages = {
    Clouds: "url(img/clouds.jpg)",
    Rain: "url(img/rainy.jpg)",
    Clear: "url(img/clear.jpg)",
    Snow: "url(img/snow.jpg)",
    Sunny: "url(img/sunny.jpg)",
    Thunderstorm: "url(img/thunderstrom.jpg)",
    Drizzle: "url(img/drizzle.jpg)",
    Mist: "url(img/mist.jpg)",
    Haze: "url(img/mist.jpg)",
    Fog: "url(img/mist.jpg)",
  };
  document.body.style.backgroundImage = bgImages[status] || "url(img/bg.jpg)";
}

// Get weather icon class
function getIconClass(classarg) {
  const iconClasses = {
    Rain: "fas fa-cloud-showers-heavy",
    Clouds: "fas fa-cloud",
    Clear: "fas fa-cloud-sun",
    Snow: "fas fa-snowman",
    Sunny: "fas fa-sun",
    Mist: "fas fa-smog",
    Thunderstorm: "fas fa-thunderstorm",
    Drizzle: "fas fa-cloud-rain",
  };
  return iconClasses[classarg] || "fas fa-cloud-sun";
}

// Reset the input box
function reset() {
  document.getElementById("input-box").value = "";
}

// Add leading zero to time values
function addZero(i) {
  return i < 10 ? "0" + i : i;
}
