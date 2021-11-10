import '../css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './services/fetchCountries';

const DEBOUNCE_DELAY = 300;


const searchbox = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchbox.addEventListener('input', debounce(() => {
    if (searchbox.value.trim() === '') {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        return;
    };
    
    fetchCountries(searchbox.value.trim())
      .then(userdata => showCountries(userdata))
      .catch(error => showError(error));
  }, DEBOUNCE_DELAY));


function showCountries(counrtries) {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';

     if (counrtries.length > 10) {
     return Notify.success("Too many matches found. Please enter a more specific name.");
    }

    if ((counrtries.length >= 2) && (counrtries.length <= 10)) {
        const markup = counrtries.map(item => 
            `<li>
            <img src="${item.flags.svg}" class="avatar" alt="flag" width="30" />
            <span>${item.name.official}</span></li>`
        ).join('');
        return countryListEl.insertAdjacentHTML('beforeend', markup);
    }
    const country = counrtries[0];
    const markup = `<img src="${country.flags.svg}" class="avatar" alt="flag" width="30" />
            <span class = 'title'>${country.name.official}</span>
            <ul class = 'text'>
            <li>Capital: <span class = 'text__normal'>${country.capital}</span></li>
            <li>Population: <span class = 'text__normal'>${country.population}</span></li>
            <li>Languages: <span class = 'text__normal'>${Object.keys(country.languages).join(', ')}</span></li>
            </ul>`;
    
    return countryInfoEl.insertAdjacentHTML('beforeend', markup);
}

function showError() {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
  return Notify.failure("Oops, there is no country with that name");
}