const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const statusBox = document.querySelector("#status");
const weatherContent = document.querySelector("#weather-content");
const welcomeState = document.querySelector("#welcome-state");
const API_KEY = window.OPENWEATHER_API_KEY || "";

function showStatus(message, type = "loading") {
  statusBox.className = `status ${type}`;
  statusBox.replaceChildren();
  if (type === "loading") {
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    spinner.setAttribute("aria-hidden", "true");
    statusBox.append(spinner);
  }
  const text = document.createElement("span");
  text.textContent = message;
  statusBox.append(text);
  statusBox.hidden = false;
}
function hideStatus() { statusBox.hidden = true; statusBox.replaceChildren(); }
function setText(id, value) { document.getElementById(id).textContent = value; }

function getWeatherEmoji(condition, iconCode = "") {
  const value = (condition || "").toLowerCase();
  if (value.includes("thunder")) return "ϟ";
  if (value.includes("rain") || value.includes("drizzle")) return "☂";
  if (value.includes("snow")) return "❄";
  if (value.includes("cloud")) return iconCode.includes("n") ? "☾" : "☁";
  if (["mist", "fog", "haze", "smoke"].some(word => value.includes(word))) return "≋";
  return iconCode.includes("n") ? "☾" : "☀";
}
function windDirection(degrees) {
  if (typeof degrees !== "number") return "Wind conditions";
  return `${["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(degrees / 45) % 8]} wind`;
}
function formatLocationDate(timestamp, offset) {
  const date = new Date((timestamp + offset) * 1000);
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}
function formatTime(timestamp) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(timestamp * 1000));
}
function renderWeather(data) {
  const weather = data.weather?.[0] || {};
  const main = data.main || {};
  const wind = data.wind || {};
  setText("location-name", `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`);
  setText("local-date", formatLocationDate(data.dt, data.timezone || 0));
  setText("weather-description", weather.description || weather.main || "Conditions unavailable");
  setText("weather-emoji", getWeatherEmoji(weather.main, weather.icon));
  setText("temperature", `${Math.round(main.temp)}°`);
  setText("feels-like", `Feels like ${Math.round(main.feels_like)}°C`);
  setText("temp-high", `${Math.round(main.temp_max)}°`);
  setText("temp-low", `${Math.round(main.temp_min)}°`);
  setText("humidity", `${main.humidity ?? "--"}%`);
  document.querySelector("#wind-speed").firstChild.textContent = `${typeof wind.speed === "number" ? wind.speed.toFixed(1) : "--"} `;
  setText("wind-direction", windDirection(wind.deg));
  document.querySelector("#pressure").firstChild.textContent = `${main.pressure ?? "--"} `;
  document.querySelector("#visibility").firstChild.textContent = `${typeof data.visibility === "number" ? (data.visibility / 1000).toFixed(1) : "--"} `;
  setText("weather-updated", `Updated ${formatTime(data.dt)}`);
  weatherContent.hidden = false;
  welcomeState.hidden = true;
}
function errorMessage(data, response) {
  const code = Number(data?.cod || response.status);
  if (code === 401) return "Your API key was rejected. Check config.js and make sure your OpenWeatherMap key is active.";
  if (code === 404) return "We couldn't find that city. Check the spelling and try again.";
  if (code === 429) return "Too many requests. Please wait a little and try again.";
  if (code === 400) return "Please enter a valid city name and try again.";
  return data?.message ? `Weather service error: ${data.message}. Please try again.` : `Weather request failed (HTTP ${response.status}). Please try again.`;
}
async function fetchWeather(city) {
  if (!API_KEY || API_KEY === "PASTE_YOUR_OPENWEATHER_API_KEY_HERE") {
    showStatus("Add your OpenWeatherMap API key in config.js first, then search again.", "error");
    return;
  }
  searchButton.disabled = true;
  searchButton.querySelector("span:first-child").textContent = "Loading…";
  cityInput.setAttribute("aria-busy", "true");
  showStatus(`Fetching current weather for ${city.trim()}…`, "loading");
  try {
    const params = new URLSearchParams({ q: city.trim(), appid: API_KEY, units: "metric" });
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok || Number(data.cod) !== 200) throw new Error(errorMessage(data, response));
    renderWeather(data);
    hideStatus();
  } catch (error) {
    showStatus(error instanceof TypeError
      ? "Could not connect to the weather service. Check your internet connection and try again."
      : (error.message || "Something went wrong. Please try again."), "error");
  } finally {
    searchButton.disabled = false;
    searchButton.querySelector("span:first-child").textContent = "Get weather";
    cityInput.removeAttribute("aria-busy");
  }
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) { showStatus("Please enter a city name to search for weather.", "error"); cityInput.focus(); return; }
  await fetchWeather(city);
});
if (API_KEY && API_KEY !== "PASTE_YOUR_OPENWEATHER_API_KEY_HERE") fetchWeather(cityInput.value);
