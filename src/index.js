import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';


const DEBOUNCE_DELAY = 300;
const searchBox = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearchInputChange, DEBOUNCE_DELAY));

function onSearchInputChange(event) {
const searchName = event.target.value.trim();
clearCountryMarkup();

    if (searchName !== '') {
fetchCountries(searchName)
.then(data => renderCountryMarkup(data))
.catch(error => Notiflix.Notify.failure('Oops, there is no country with that name.'));
}
}

function clearCountryMarkup() {
countryListEl.innerHTML = '';
countryInfoEl.innerHTML = '';
}

function renderCountryMarkup(data) {
if (data.length > 10) {
Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
return;
} else if (data.length >= 2 && data.length <= 10) {
renderCountryList(data);
return;
} else {
renderCountryInfo(data[0]);
return;
}
}

function renderCountryList(data) {
  const countryItems = data.map(item => {
    const wikiLink = `https://en.wikipedia.org/wiki/${item.name.official}`;
    return `<li class="country_item">
              <img class="country_flag" src="${item.flags.svg}" alt="Country flag" width="50px" />
              <p class="country_name">${item.name.official}</p>
              <a class="country_wiki" href="${wikiLink}" target="_blank">Read more</a>
            </li>`;
  });

  countryListEl.insertAdjacentHTML('beforeend', countryItems.join(''));
}

function renderCountryInfo(data) {
const languages = Object.values(data.languages).join(', ');

const countryInfoMarkup = `<div class="country-info_main"> <img class="country_flag" src="${data.flags.svg}" alt="Country flag" width="50px" /> <h2 class="country_name--main">${data.name.official}</h2> </div> <p class="country_spec"><b>Capital: </b>${data.capital}</p> <p class="country_spec"><b>Population: </b>${data.population} inhabitants</p> <p class="country_spec"><b>Languages: </b>${languages}</p> `;

countryInfoEl.insertAdjacentHTML('beforeend', countryInfoMarkup);
}