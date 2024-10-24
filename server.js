import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const sendData = {
        location: "Location",
        temp: "Temp",
        desc: "Description",
        feel: "Feel-like",
        pressure: "Pressure",
        humidity: "Humidity",
        visibility: "Visibility",
        country: "",
        speed: "speed",
    };
    res.render("index.ejs", {sendData: sendData});
});

app.post("/", async (req, res) => {
    try {
        const location = req.body.city;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
        const response = await axios.get(url);
        const weatherData = response.data;
        // console.log(weatherData);
        const temp = Math.floor(weatherData.main.temp);
        const pressure = weatherData.main.pressure;
        const humidity = weatherData.main.humidity;
        const visibility = weatherData.visibility;
        const desc = weatherData.weather[0].description;
        const feel = weatherData.main.feels_like;
        const speed = weatherData.wind.speed;
        const country = weatherData.sys.country;
        const sendData = {};
        sendData.temp = temp;
        sendData.desc = desc;
        sendData.pressure = pressure;
        sendData.humidity = humidity;
        sendData.visibility = visibility;
        sendData.location = location;
        sendData.feel = feel;
        sendData.speed = speed;
        sendData.country = country;
        res.render('index', {sendData: sendData});
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
