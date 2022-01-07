import {
  getCurrentWeather,
  oneCall,
  extractRelavantData,
  extractDailyCardData,
} from './weatherAPI.js';

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

const clearCards = function () {
  const cardContainer = document.querySelector('.card-container');
  cardContainer.textContent = '';
}

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
  img.src = '../src/images/icons/reshot-icon-cloud-sun-KQ247TGXSF.svg';
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
}

async function handleLocationFormSubmit(e) {
  e.preventDefault();
  const searchInput = e.target.children[0];
  const searchValue = searchInput.value;

  const data = await getCurrentWeather(searchValue);
  const summary = await oneCall(data.coord.lon, data.coord.lat);
  const dailyCards = extractDailyCardData(summary);
  
  clearCards();
  dailyCards.forEach(renderDayCard);

  searchInput.value = '';
  searchInput.focus();
}

renderLocationForm();

export { renderLocationForm, renderDayCard };
