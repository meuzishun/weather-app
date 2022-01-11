import * as weatherAPI from './weatherAPI.js';
import * as utilities from './utilities.js';

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
  const locationName = await getLocationName(data);
  renderLocationHeader(locationName);
  const weatherData = await getLocationWeather(data);
  renderMainDisplay(weatherData);
};

const handleTextInput = async function (input) {
  const locations = await weatherAPI.getLocationsFromNames(input);
  if (locations.length === 1) {
    const locationName = await getLocationName(locations[0]);
    renderLocationHeader(locationName);
    const weatherData = await getLocationWeather(locations[0]);
    renderMainDisplay(weatherData);
  } else {
    console.log(locations);
    renderSearchResults(locations);
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

const renderLocationHeader = function (locationName) {
  const locationHeading = document.querySelector('.location-title');
  locationHeading.textContent = `${locationName.name}, ${locationName.state}, ${locationName.country}`;
};

const displays = {
  currenty: null,
  hourly: null,
  daily: null,
};

const handleNavItemClick = function (e) {
  const tab = e.target;
  [...tab.parentElement.children].forEach((child) =>
    child.classList.remove('active')
  );
  tab.classList.add('active');
  const tabData = tab.dataset.content;
  renderWeatherDisplay(displays[tabData]);
};

const renderWeatherNav = function () {
  const weatherNav = document.createElement('nav');
  weatherNav.className = 'weather-nav';

  const currentlyTab = document.createElement('p');
  currentlyTab.className = 'currently-tab';
  currentlyTab.dataset.content = 'currently';
  currentlyTab.textContent = 'currently';
  weatherNav.appendChild(currentlyTab);

  const hourlyTab = document.createElement('p');
  hourlyTab.className = 'hourly-Tab';
  hourlyTab.dataset.content = 'hourly';
  hourlyTab.textContent = 'hourly';
  weatherNav.appendChild(hourlyTab);

  const dailyTab = document.createElement('p');
  dailyTab.className = 'daily-Tab';
  dailyTab.dataset.content = 'daily';
  dailyTab.textContent = 'daily';
  weatherNav.appendChild(dailyTab);

  currentlyTab.classList.add('active');
  return weatherNav;
};

const renderMainDisplay = function (weatherData) {
  const main = document.querySelector('main');
  utilities.removeElementContents(main);

  displays['currently'] = renderCurrentlyDisplay(weatherData.current);
  displays['hourly'] = renderHourlyDisplay(weatherData.hourly);
  displays['daily'] = renderDailyDisplay(weatherData.daily);

  const weatherNav = renderWeatherNav();
  [...weatherNav.children].forEach((navItem) => {
    navItem.addEventListener('click', handleNavItemClick);
  });

  main.appendChild(weatherNav);
  renderWeatherDisplay(displays['currently']);
};

const renderWeatherDisplay = function (display) {
  const main = document.querySelector('main');
  const elem = main.children[1];
  if (elem) {
    main.removeChild(elem);
  }
  main.appendChild(display);
};

const renderCurrentlyDisplay = function (data) {
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'content-wrapper';

  const imgContainer = document.createElement('div');
  imgContainer.className = 'image-container';
  contentWrapper.appendChild(imgContainer);

  const textContainer = document.createElement('div');
  textContainer.className = 'text-container';
  contentWrapper.appendChild(textContainer);

  const icon = data.weather[0].icon;
  const image = document.createElement('img');
  image.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  imgContainer.appendChild(image);

  const currentTime = document.createElement('p');
  currentTime.textContent = `Time: ${utilities.formatTime(data.dt)}`;
  textContainer.appendChild(currentTime);

  const currentTemp = document.createElement('p');
  currentTemp.textContent = `Temp: ${Math.round(
    utilities.temperatureConversion('fahrenheit', 'kelvin', data.temp)
  )}ºF`;
  textContainer.appendChild(currentTemp);

  const feelsLike = document.createElement('p');
  feelsLike.textContent = `Feels like: ${Math.round(
    utilities.temperatureConversion('fahrenheit', 'kelvin', data.feels_like)
  )}ºF`;
  textContainer.appendChild(feelsLike);

  const sunrise = document.createElement('p');
  sunrise.textContent = `Sunrise: ${utilities.formatTime(data.sunrise)}`;
  textContainer.appendChild(sunrise);

  const sunset = document.createElement('p');
  sunset.textContent = `Sunset: ${utilities.formatTime(data.sunset)}`;
  textContainer.appendChild(sunset);

  const humidity = document.createElement('p');
  humidity.textContent = `Humidity: ${data.humidity}%`;
  textContainer.appendChild(humidity);

  const windSpeed = document.createElement('p');
  windSpeed.textContent = `Wind speed: ${Math.round(
    utilities.convert_metersSec_to_mph(data.wind_speed)
  )} mph`;
  textContainer.appendChild(windSpeed);

  const description = document.createElement('p');
  description.textContent = `${data.weather[0].description}`;
  imgContainer.appendChild(description);

  return contentWrapper;
};

const renderHourlyDisplay = function (data) {
  console.log(data);
  const hourlyCardContainer = document.createElement('div');
  hourlyCardContainer.className = 'hourly-card-container';

  data.forEach((hour) => {
    const hourCard = renderHourCard(hour);
    hourlyCardContainer.appendChild(hourCard);
  });

  return hourlyCardContainer;
};

const renderDailyDisplay = function (data) {
  return renderDayCards(data);
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
  const searchResults = document.querySelector('.search-results');
  clearElementContents(searchResults);
};

const renderSearchResults = function (locations) {
  // const header = document.querySelector('header');
  // clearElementContents(header);
  // const resultsContainer = document.querySelector('.search-results');
  // clearElementContents(resultsContainer);
  // const cardContainer = document.querySelector('.card-container');
  // clearElementContents(cardContainer);

  const main = document.querySelector('main');
  utilities.removeElementContents(main);

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results-container';
  
  const locationsContainer = document.createElement('div');
  locationsContainer.className = 'locations-container';

  const resultsHeading = document.createElement('h3');
  resultsHeading.className = 'results-heading';
  resultsHeading.textContent = 'Did you mean...';

  locations.forEach((location) => {
    const locationResult = document.createElement('p');
    locationResult.className = 'location-result';
    locationResult.textContent = `${location.name}, ${location.state}, ${location.country}?`;
    locationResult.dataset.lat = location.lat;
    locationResult.dataset.lon = location.lon;
    locationResult.addEventListener('click', handleLocationClick);
    locationsContainer.appendChild(locationResult);
  });

  resultsContainer.appendChild(resultsHeading);
  resultsContainer.appendChild(locationsContainer);
  main.appendChild(resultsContainer);
};

const renderHourCard = function (data) {
  const hourCard = document.createElement('div');
  hourCard.className = 'hour-card';

  const timeContainer = document.createElement('div');
  timeContainer.className = 'day-container';
  hourCard.appendChild(timeContainer);

  const time = document.createElement('p');
  time.textContent = `${utilities.formatTime(data.dt) === '0:00 AM' ? '12:00 AM' : utilities.formatTime(data.dt) === '0:00 PM' ? '12:00 PM' : utilities.formatTime(data.dt)}`;
  timeContainer.appendChild(time);

  const imgContainer = document.createElement('div');
  imgContainer.className = 'img-container';
  hourCard.appendChild(imgContainer);

  const img = document.createElement('img');
  img.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  imgContainer.appendChild(img);

  const tempContainer = document.createElement('div');
  tempContainer.className = 'temp-container';
  hourCard.appendChild(tempContainer);

  const tempText = document.createElement('p');
  tempText.textContent = `${Math.round(
    utilities.temperatureConversion('fahrenheit', 'kelvin', data.temp)
  )}ºF`;
  tempContainer.appendChild(tempText);

  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'description-container';
  hourCard.appendChild(descriptionContainer);

  const description = document.createElement('p');
  description.textContent = data.weather[0].description;
  descriptionContainer.appendChild(description);

  const percipitationContainer = document.createElement('div');
  percipitationContainer.className = 'percipitation-container';
  hourCard.appendChild(percipitationContainer);

  const percipitation = document.createElement('p');
  percipitation.textContent = `${Math.round(data.pop * 100)}%`;
  percipitationContainer.appendChild(percipitation);

  return hourCard;
};

const renderDayCard = function (data) {
  const dayCard = document.createElement('div');
  dayCard.className = 'day-card';

  const dayContainer = document.createElement('div');
  dayContainer.className = 'day-container';
  dayCard.appendChild(dayContainer);

  const day = document.createElement('p');
  day.textContent = data.day_of_week;
  dayContainer.appendChild(day);

  const imgContainer = document.createElement('div');
  imgContainer.className = 'img-container';
  dayCard.appendChild(imgContainer);

  const img = document.createElement('img');
  img.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  imgContainer.appendChild(img);

  const tempContainer = document.createElement('div');
  tempContainer.className = 'temp-container';
  dayCard.appendChild(tempContainer);

  const highTempText = document.createElement('p');
  highTempText.textContent = `High: ${Math.round(utilities.temperatureConversion('fahrenheit', 'kelvin', data.temp.max))}`;
  tempContainer.appendChild(highTempText);

  const lowTempText = document.createElement('p');
  lowTempText.textContent = `Low: ${Math.round(utilities.temperatureConversion('fahrenheit', 'kelvin', data.temp.min))}`;
  tempContainer.appendChild(lowTempText);

  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'description-container';
  dayCard.appendChild(descriptionContainer);

  const description = document.createElement('p');
  description.textContent = data.weather[0].description;
  descriptionContainer.appendChild(description);

  return dayCard;
};

const renderDayCards = function (data) {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';
  data.forEach((day, index) => {
    const today = new Date();
    day.day_of_week = utilities.getDayOfWeek((today.getDay() + index) % 7);
    const dayCard = renderDayCard(day);
    cardContainer.appendChild(dayCard);
  });
  return cardContainer;
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
parseInputValue('01801');
// parseInputValue('boston, massachusetts, us');

export { renderLocationForm, renderDayCard };
