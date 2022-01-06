import { getWeatherData, extractRelavantData } from './weatherAPI.js';

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
  elements[0];
}

async function handleLocationFormSubmit(e) {
  e.preventDefault();
  const searchInput = e.target.children[0];
  const searchValue = searchInput.value;
  console.log(searchValue);
  const data = await getWeatherData(searchValue);
  const relavantData = extractRelavantData(data);
  searchInput.value = '';
  searchInput.focus();
  console.log(relavantData.name);
  console.table(relavantData.weather);
  console.log(data);
}

renderLocationForm();

export { renderLocationForm };
