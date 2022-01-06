import { getCurrentWeather, oneCall, extractRelavantData } from './weatherAPI.js';

function renderLocationForm() {
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
  document.body.appendChild(elements[0]);
}

async function handleLocationFormSubmit(e) {
  e.preventDefault();
  const searchInput = e.target.children[0];
  const searchValue = searchInput.value;
  console.log(searchValue);

  const data = await getCurrentWeather(searchValue);
  // console.log(data);
  // const relavantData = extractRelavantData(data);

  const summary = await oneCall(data.coord.lon, data.coord.lat);
  // console.log(summary);

  summary.hourly.forEach(min => console.log(new Date(min.dt)));

  searchInput.value = '';
  searchInput.focus();
}

// renderLocationForm();

export { renderLocationForm };
