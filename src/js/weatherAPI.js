import { temperatureConversion } from "./utilities.js";

const getCurrentWeather = async function (location) {
  try {
    const API_key = 'd4a3732932608b542cb92d60253a6c4f';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_key}`;
    const response = await fetch(url, { mode: 'cors' });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

const getLocations = async function (searchValue) {
  try {
    const API_key = 'd4a3732932608b542cb92d60253a6c4f';
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=${API_key}`;
    const response = await fetch(url, { mode: 'cors' });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }

}

const oneCall = async function (lon, lat) {
  try {
    const API_key = 'd4a3732932608b542cb92d60253a6c4f';
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_key}`;
    const response = await fetch(url, { mode: 'cors' });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

const extractDailyCardData = function(summary) {
  const today = new Date();
  const weekdayLookup = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  const dailyCards = summary.daily.map((day, index) => {
    if (index < 6) {
      const weekday = weekdayLookup[(today.getDay() + index) % 6];
      const icon = day.weather[0].icon;
      // const temp = `${Math.round((((day.temp.day - 273.15) * 9) / 5) + 32)}º`;
      const temp = `${Math.round(temperatureConversion('fahrenheit', 'kelvin', day.temp.day))}º`;
      const description = day.weather[0].description;
      return { weekday, icon, temp, description };
    }
  });
  dailyCards.length = 6;
  return dailyCards;
}

function extractRelavantData(data) {
  const importantData = {
    name: data.name,
    weather: data.weather,
  };
  return importantData;
}

export {
  getCurrentWeather,
  getLocations,
  oneCall,
  extractRelavantData,
  extractDailyCardData,
};
