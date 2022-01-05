import { getWeatherData, extractRelavantData } from './js/weatherAPI.js';

(async () => {
  let currentWeather = await getWeatherData('boston');
  console.log(currentWeather);
  let importantStuff = extractRelavantData(currentWeather);
  console.log(importantStuff);
})();
