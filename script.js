const url = 'https://restcountries.com/v3.1/all?fields=name,capital,flags';

let countryList = [];

let currentCountryIndex = -1;
let prevousCountryIndex = -1;

function fetchCountries() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fetch error:: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(country => {
                countryList.push({
                    name: country.name.common,
                    capital: country.capital ? country.capital[0] : 'N/A',
                    flag: country.flags.png
                });
            });
            loadQuestion();
        })
        .catch(error => {
            console.error('Error fetching country data:', error);
        });
}

function loadQuestion() {
    if (countryList.length === 0) {
        console.error('Country list is empty. Cannot load question.');
        return;
    }

    prevousCountryIndex = currentCountryIndex;
    currentCountryIndex = getNewIndex();
    
    const country = countryList[currentCountryIndex];
}

function getNewIndex() {
    while (true) {
        currentCountryIndex = Math.floor(Math.random() * countryList.length);
        if (currentCountryIndex !== prevousCountryIndex) {
            break;
        }
    }
    return currentCountryIndex;
}


document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
});