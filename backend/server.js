require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Weather API server is running"
    });
});

// Weather route
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;
    
    if (!city) {
    return res.status(400).json({
        error: "City is required"
    });
}

    const apiKey = process.env.OPENWEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

 try {
    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
    return res.status(response.status).json({
        error: data.message || "Unable to fetch weather data"
    });
}

    console.log(data);

    res.json({
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
    });
} catch (error) {
    console.error(error);

    res.status(500).json({
        error: "Server error while fetching weather data"
    });
}
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

console.log("API key loaded:", !!process.env.OPENWEATHER_API_KEY);
