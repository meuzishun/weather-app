import {
  getCurrentWeather,
  getLocations,
  oneCall,
  extractRelavantData,
  extractDailyCardData,
} from './weatherAPI.js';

const renderLocationHeader = function (data) {
  const header = document.querySelector('header');
  const locationTitle = document.createElement('h2');
  locationTitle.className = 'location-title';
  locationTitle.textContent = data;
  header.insertBefore(locationTitle, header.children[0]);
};

function renderLocationForm() {
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
}

const renderSearchResults = function (locations) {
  const resultsHeading = document.createElement('h3');
  resultsHeading.className = 'results-heading';
  resultsHeading.textContent = 'Did you mean...';
  // create a container for the choices
  const locationsContainer = document.createElement('div');
  locationsContainer.className = 'locations-container';

  locations.forEach((location) => {
    console.log(location);
    // create individual elements that contain: city name, state, country...
    const locationResult = document.createElement('p');
    locationResult.className = 'location-result';
    locationResult.textContent = `${location.name}, ${location.state}, ${location.country}?`;
    // use dataset to attach their lat/lon
    locationResult.dataset.lat = location.lat;
    locationResult.dataset.lon = location.lon;
    // add click events that will feed lat/lon to oneCall function
    locationResult.addEventListener('click', console.log);
    locationsContainer.appendChild(locationResult);
  });

  document.body.appendChild(resultsHeading);
  document.body.appendChild(locationsContainer);
};

const clearCards = function () {
  const cardContainer = document.querySelector('.card-container');
  cardContainer.textContent = '';
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

  const tempText = document.createElement('p');
  tempText.textContent = data.temp;
  tempContainer.appendChild(tempText);

  const descriptionContainer = document.createElement('div');
  descriptionContainer.className = 'description-container';
  dayCard.appendChild(descriptionContainer);

  const description = document.createElement('p');
  description.textContent = data.description;
  descriptionContainer.appendChild(description);
};

const renderDayCards = function (summary) {
  const dailyData = extractDailyCardData(summary);
  clearCards();
  dailyData.forEach(renderDayCard);
};

const registerWeatherSearch = async function (searchValue) {
  // const data = await getCurrentWeather(searchValue);
  // console.log(data);
  // const summary = await oneCall(data.coord.lon, data.coord.lat);
  // console.log(summary);
  // renderDayCards(summary);

  // renderLocationHeader(data.name);

  const locations = await getLocations(searchValue);
  renderSearchResults(locations);
};

function handleLocationFormSubmit(e) {
  e.preventDefault();
  const searchInput = e.target.children[0];
  registerWeatherSearch(searchInput.value);
  searchInput.value = '';
  searchInput.focus();
}

renderLocationForm();
// registerWeatherSearch('boston');
registerWeatherSearch('london');

export { renderLocationForm, renderDayCard };
