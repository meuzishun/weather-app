// store the API key
const API_key = 'd4a3732932608b542cb92d60253a6c4f';

// write a function that fetches a location based on zipcode
export const getLocationFromZip = async function (zip_code, country_code) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/zip?zip=${zip_code}${
      country_code ? ',' + country_code : ''
    }&appid=${API_key}`,
    { mode: 'cors' }
  );
  const data = await response.json();
  return data;
};

// write a function that fetches locations from coords
export const getLocationsFromCoords = async function (lat, lon, limit) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${API_key}`,
    { mode: 'cors' }
  );
  const data = await response.json();
  return data;
};

// write a function that fetches locations from names
export const getLocationsFromNames = async function (city_name, state_code, country_code) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city_name}${state_code ? ',' + state_code : ''}${country_code ? ',' + country_code : ''}&limit=5&appid=${API_key}`,
    { mode: 'cors' }
  );
  const data = await response.json();
  return data;
}

// write a function that fetches weather data from coords
export const getWeatherFromCoords = async function (lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_key}`,
    { mode: 'cors' }
  );
  const data = await response.json();
  return data;
};

// write a function that grabs the user input

// write a function that verifies the user input

// write a function that checks the user input for specificity
// if the user input is a zipcode
