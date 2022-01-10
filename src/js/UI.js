import * as weatherAPI from './weatherAPI.js';
import * as utilities from './utilities.js';

// write a function that creates the markup for search form and adds an event listener to it

const getLocationName = async function (data) {
  const { lat, lon } = data;
  const location = await weatherAPI.getLocationsFromCoords(lat, lon, 1);
  const { name, state, country } = location[0];
  return { name, state, country };
};

const getLocationWeather = async function (data) {
  const { lat, lon } = data;
  const weatherData = await weatherAPI.getWeatherFromCoords(lat, lon);
  return weatherData;
};

const handleZipcodeInput = async function (input) {
  const data = await weatherAPI.getLocationFromZip(input);
  console.log(data);
  const location = await getLocationName(data);
  console.log(location);
  const weatherData = await getLocationWeather(data);
  console.log(weatherData);
};

const handleTextInput = async function (input) {
  const locations = await weatherAPI.getLocationsFromNames(input);
  if (locations.length === 1) {
    const location = await getLocationName(locations[0]);
    const weatherData = await getLocationWeather(locations[0]);
    console.log(location);
    console.log(weatherData);
  } else {
    console.log(locations);
  }
};

const parseInputValue = function (inputValue) {
  if (/^\d{5}(?:[-\s]\d{4})?$/.test(inputValue)) {
    handleZipcodeInput(inputValue);
  } else {
    handleTextInput(inputValue);
  }
};

export const handleSearchSubmission = async function (e) {
  e.preventDefault();
  const input = e.target.children[0];
  const inputValue = input.value;
  parseInputValue(inputValue);
  input.value = '';
};

const locationForm = document.querySelector('.location-form');
locationForm.addEventListener('submit', handleSearchSubmission);

const renderLocationHeader = function (data) {
  const header = document.querySelector('header');
  clearElementContents(header);
  const locationTitle = document.createElement('h2');
  locationTitle.className = 'location-title';
  locationTitle.textContent = data || 'Weather';
  header.insertBefore(locationTitle, header.children[0]);
  renderLocationForm();
};

const renderLocationForm = function () {
  const header = document.querySelector('header');

  const elementTypes = ['form', 'input', 'button'];

  const elements = elementTypes.map((type) => {
    const elem = document.createElement(type);
    elem.className = `location-${type}`;

    if (type === 'label') {
      elem.htmlFor = 'location-input';
      elem.textContent = 'location:';
    }

    if (type === 'input') {
      elem.id = 'location-input';
      elem.placeholder = 'enter location...';
    }

    if (type === 'button') {
      elem.type = 'submit';
      elem.textContent = 'search';
    }
    return elem;
  });

  elements.forEach((elem, index, elements) => {
    if (index > 0) elements[0].appendChild(elem);
  });

  elements[0].addEventListener('submit', handleLocationFormSubmit);
  header.appendChild(elements[0]);
};

const handleLocationClick = async function (e) {
  const elem = e.target;
  const location = elem.innerText.slice(0, -1);
  const lat = elem.dataset.lat;
  const lon = elem.dataset.lon;
  const summary = await oneCall(lat, lon);
  const resultsHeading = document.querySelector('.results-heading');
  deleteSelf(resultsHeading);
  renderLocationHeader(location);
  renderDayCards(summary);
  // renderCurrentData(summary);
  const searchResults = document.querySelector('.search-results');
  clearElementContents(searchResults);
};

const renderSearchResults = function (locations) {
  const header = document.querySelector('header');
  clearElementContents(header);
  const resultsContainer = document.querySelector('.search-results');
  clearElementContents(resultsContainer);
  const cardContainer = document.querySelector('.card-container');
  clearElementContents(cardContainer);

  const resultsHeading = document.createElement('h3');
  resultsHeading.className = 'results-heading';
  resultsHeading.textContent = 'Did you mean...';
  // create a container for the choices
  const locationsContainer = document.createElement('div');
  locationsContainer.className = 'locations-container';

  locations.forEach((location) => {
    // create individual elements that contain: city name, state, country...
    const locationResult = document.createElement('p');
    locationResult.className = 'location-result';
    locationResult.textContent = `${location.name}, ${location.state}, ${location.country}?`;
    // use dataset to attach their lat/lon
    locationResult.dataset.lat = location.lat;
    locationResult.dataset.lon = location.lon;
    // add click events that will feed lat/lon to oneCall function
    locationResult.addEventListener('click', handleLocationClick);
    locationsContainer.appendChild(locationResult);
  });

  resultsContainer.appendChild(resultsHeading);
  resultsContainer.appendChild(locationsContainer);
};

const renderDayCard = function (data) {
  const cardContainer = document.querySelector('.card-container');

  const dayCard = document.createElement('div');
  dayCard.className = 'day-card';
  cardContainer.appendChild(dayCard);

  const dayContainer = document.createElement('div');
  dayContainer.className = 'day-container';
  dayCard.appendChild(dayContainer);

  const day = document.createElement('p');
  day.textContent = data.weekday;
  dayContainer.appendChild(day);

  const imgContainer = document.createElement('div');
  imgContainer.className = 'img-container';
  dayCard.appendChild(imgContainer);

  const img = document.createElement('img');
  img.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
  imgContainer.appendChild(img);

  const tempContainer = document.createElement('div');
  tempContainer.className = 'temp-container';
  dayCard.appendChild(tempContainer);

  const highTempText = document.createElement('p');
  highTempText.textContent = `High: ${data.high}`;
  tempContainer.appendChild(highTempText);

  const lowTempText = document.createElement('p');
  lowTempText.textContent = `Low: ${data.low}`;
  tempContainer.appendChild(lowTempText);

  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'description-container';
  dayCard.appendChild(descriptionContainer);

  const description = document.createElement('p');
  description.textContent = data.description;
  descriptionContainer.appendChild(description);
};

const renderDayCards = function (summary) {
  const dailyData = extractDailyCardData(summary);
  clearElementContents(document.querySelector('.card-container'));
  dailyData.forEach(renderDayCard);
};

const renderCurrentData = function (summary) {
  const currentWeatherContainer = document.querySelector('.current-weather');

  console.log(summary);

  // const currentTime = document.createElement('p');
  // currentTime.className = 'current-time';
  // currentTime.textContent = `Current time: ${formatTime(summary.dt)}`;
  // currentWeatherContainer.appendChild(currentTime);

  // const sunrise = document.createElement('p');
  // sunrise.className = 'sunrise';
  // sunrise.textContent = `Sunrise: ${formatTime(summary.sunrise)}`;
  // currentWeatherContainer.appendChild(sunrise);

  // const sunset = document.createElement('p');
  // sunset.className = 'sunset';
  // sunset.textContent = `Sunset: ${formatTime(summary.sunset)}`;
  // currentWeatherContainer.appendChild(sunset);

  // const currentTemp = document.createElement('p');
  // currentTemp.className = 'current-temp';
  // currentTemp.textContent = `Current temp: ${Math.round(temperatureConversion('fahrenheit','kelvin', summary.temp))}º`;
  // currentWeatherContainer.appendChild(currentTemp);

  // const feelsLike = document.createElement('p');
  // feelsLike.className = 'feels-like';
  // feelsLike.textContent = `Feels like: ${Math.round(temperatureConversion('fahrenheit','kelvin', summary.feels_like))}º`;
  // currentWeatherContainer.appendChild(feelsLike);

  // const weather = document.createElement('p');
  // weather.className = 'weather';
  // weather.textContent = `Weather: ${summary.weather[0].description}`;
  // currentWeatherContainer.appendChild(weather);

  const currentSummary = document.createElement('p');
  currentSummary.className = 'current-summary';
  currentSummary.textContent = `${formatTime(summary.dt)}, ${Math.round(
    temperatureConversion('fahrenheit', 'kelvin', summary.temp)
  )}º (feels like ${Math.round(
    temperatureConversion('fahrenheit', 'kelvin', summary.feels_like)
  )}º), ${summary.weather[0].description}`;
  currentWeatherContainer.appendChild(currentSummary);
  // for (const key in summary) {
  //   const para = document.createElement('p');
  //   para.textContent = `${key}: ${summary[key]}`;
  //   dayDetailsContainer.appendChild(para);
  // }
};

const registerWeatherSearch = async function (searchValue) {
  // const data = await getCurrentWeather(searchValue);
  // console.log(data);
  // const summary = await oneCall(data.coord.lat, data.coord.lon);
  // console.log(summary);
  // renderDayCards(summary);

  // renderLocationHeader(data.name);
  const url = createLocationURL(searchValue);
  const locations = await getLocations(url);
  if (Array.isArray(locations)) {
    renderSearchResults(locations);
  } else {
    const summary = await oneCall(locations.lat, locations.lon);
    const header = document.querySelector('header');
    clearElementContents(header);
    renderLocationHeader(`${locations.name}, ${locations.country}`);
    renderDayCards(summary);
    renderCurrentData(summary.current);
    console.log(summary);
  }
};

function handleLocationFormSubmit(e) {
  e.preventDefault();
  const searchInput = e.target.children[0];
  registerWeatherSearch(searchInput.value);
  searchInput.value = '';
  searchInput.focus();
}

// renderLocationForm();
// renderLocationHeader();
// registerWeatherSearch('01801');
// registerWeatherSearch('london');

export { renderLocationForm, renderDayCard };
