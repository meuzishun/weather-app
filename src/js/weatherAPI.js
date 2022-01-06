const getWeatherData = async function(location) {
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

function extractRelavantData(data) {
  const importantData = {
    name: data.name,
    weather: data.weather,
  };
  return importantData;
}

export { getWeatherData, extractRelavantData };
