# SkyCast — Asynchronous REST API Weather Portal

A responsive single-page weather portal built with Vanilla JavaScript, semantic HTML5, and CSS. It uses the Fetch API with `async/await` to retrieve current weather from OpenWeatherMap and update the UI dynamically.

## Requirements covered
- Single-page app: search another city without reloading.
- OpenWeatherMap Current Weather REST API.
- `fetch()` with `async/await`.
- Dynamic rendering of city, temperature, condition, humidity, wind, pressure, and visibility.
- Loading spinner and disabled button during requests.
- Error states for missing/invalid API key, unknown city, rate limits, network issues, and other API errors.
- Responsive mobile and desktop layouts.
- Accessible input label and `aria-live` status feedback.

## Files
- `index.html` — semantic page structure
- `style.css` — responsive visual design
- `app.js` — API calls, async flow, error handling, and UI rendering
- `config.js` — API key configuration

## Set up your API key
1. Sign up or sign in at [OpenWeatherMap](https://openweathermap.org/).
2. Create/copy an API key at https://home.openweathermap.org/api_keys.
3. Open `config.js` and replace `PASTE_YOUR_OPENWEATHER_API_KEY_HERE` with your key, keeping the quotes.
4. Save, then open `index.html` in a browser. If local file restrictions cause problems, run it with VS Code's Live Server extension.
5. Search a city such as Lahore, Karachi, London, or Tokyo.

The app requests `https://api.openweathermap.org/data/2.5/weather` with `q`, `appid`, and `units=metric`. See the [official current weather API documentation](https://openweathermap.org/current).

**Important:** a key in browser JavaScript is visible to visitors. This setup is convenient for a student demo, but production apps should keep keys on a server and proxy requests. Do not commit a real API key to a public GitHub repository.

## Upload to GitHub Pages
1. Extract this ZIP.
2. Create a repository such as `skycast-weather-portal`.
3. Upload `index.html`, `style.css`, `app.js`, `config.js`, and `README.md`.
4. Remove your real key from `config.js` before uploading publicly. You may need to enter it locally again for testing.
5. Open **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/(root)`, and save.
6. Note that a static GitHub Pages site cannot keep an API key secret; use a backend proxy for production.

## Troubleshooting
- **401:** check the API key; new keys can take time to activate.
- **404:** verify city spelling or use a country code, e.g. `Paris,FR`.
- **Network error:** check the internet connection.
- **File URL issues:** use VS Code Live Server.
