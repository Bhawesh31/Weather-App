const apiKey = 'a726172810c11c8eef53390eef1ab355';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const voiceBtn = document.getElementById('voiceBtn');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');

// Search button click
searchButton.addEventListener('click', () => {
  const location = locationInput.value.trim();
  if (location) {
    fetchWeather(location);
  }
});

// Fetch weather data
function fetchWeather(location) {
  const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        locationElement.textContent = `📍 ${data.name}`;
        temperatureElement.textContent = `🌡️ ${Math.round(data.main.temp)}°C`;
        
        const weatherDesc = data.weather[0].description.toLowerCase();
        let emoji = "";

        if (weatherDesc.includes("rain")) emoji = "🌧️";
        else if (weatherDesc.includes("cloud")) emoji = "☁️";
        else if (weatherDesc.includes("snow")) emoji = "❄️";
        else if (weatherDesc.includes("clear")) emoji = "☀️";
        else emoji = "🌡️";

        descriptionElement.textContent = `${emoji} ${data.weather[0].description}`;

        // Set background image based on condition
        updateBackground(weatherDesc);
      } else {
        locationElement.textContent = '❌ Location not found.';
        temperatureElement.textContent = '';
        descriptionElement.textContent = '';
        document.body.className = ''; // reset background
      }
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

// Update background based on weather condition
function updateBackground(condition) {
  document.body.className = ''; // clear existing classes

  if (condition.includes("rain")) {
    document.body.classList.add("rainy");
  } else if (condition.includes("cloud")) {
    document.body.classList.add("cloudy");
  } else if (condition.includes("snow")) {
    document.body.classList.add("snowy");
  } else {
    document.body.classList.add("sunny");
  }
}

// Voice input using Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = function(event) {
    const voiceInput = event.results[0][0].transcript;
    console.log("Voice input: ", voiceInput);
    locationInput.value = voiceInput; // Optional: set spoken city in input
    fetchWeather(voiceInput);
  };

  recognition.onerror = function(event) {
    console.error("Voice recognition error:", event.error);
  };
} else {
  voiceBtn.disabled = true;
  voiceBtn.innerText = "🎤 Not supported in this browser";
}
