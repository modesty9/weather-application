import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch weather information
  const getWeather = async () => {
    setError("");

    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(city.trim())}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to fetch weather data");
        setWeather(null);
        return;
      }

      setWeather(data);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the weather server");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    getWeather();
  };

  return (
    <div className={`app ${weather ? `weather-${weather.icon}` : ""}`}>
      <div className="weather-container">

        <h1 className="app-title">Weather App</h1>

        <p className="app-description">
          Check the weather in your city
        </p>

        <form className="input-container" onSubmit={handleSubmit}>
          <input
            className="city-input"
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />

          <button
            className="search-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {loading && (
          <p className="loading-message">Loading weather...</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}

        {weather && (
          <div className="weather-result">

            <h2 className="weather-city">{weather.city}</h2>

            <p className="weather-temperature">
              {Math.round(weather.temperature)}°C
            </p>

            <div className="weather-icon">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.condition}
              />
            </div>

            <p className="weather-condition">
              {weather.condition}
            </p>

            <div className="weather-details">

              <div className="weather-detail">
                <p className="detail-label">Humidity</p>
                <p className="detail-value">
                  {weather.humidity}%
                </p>
              </div>

              <div className="weather-detail">
                <p className="detail-label">Wind Speed</p>
                <p className="detail-value">
                  {weather.windSpeed} m/s
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
