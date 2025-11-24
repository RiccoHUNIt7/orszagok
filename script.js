const url = 'https://restcountries.com/v3.1/all?fields=name,capital,flags';

const flagHolder = document.getElementById('flagImage');
const buttons = document.querySelectorAll('.button');

let countryList = [];

let currentCountryIndex = -1;
let prevousCountryIndex = -1;

let correctCapital = '';
let capitals = [];

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
    
    let country = countryList[currentCountryIndex];

    flagHolder.src = country.flag;
    flagHolder.alt = `Flag of ${country.name}`;

    getNewCapitals();

    capitals.sort(() => Math.random() - 0.5);

    buttons.forEach((button, index) => {
        button.textContent = capitals[index];
        button.onclick = () => {
            if (button.textContent === correctCapital) {
                alert('Helyes válasz!');
            } else {
                alert(`Helytelen válasz! A helyes válasz: ${correctCapital}`);
            }
            loadQuestion();
        }
    });
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

function getNewCapitals() {
    clearCapitals();

    correctCapital = countryList[currentCountryIndex].capital;
    addUsedCapital(correctCapital);

    while (capitals.length < 4) {
        let randomIndex = Math.floor(Math.random() * countryList.length);
        let capital = countryList[randomIndex].capital;
        if (capitalAlreadyUsed(capital)) {
            continue;
        }
        addUsedCapital(capital);
    }
}

function capitalAlreadyUsed(capital) {
    return capitals.includes(capital);
}

function addUsedCapital(capital) {
    capitals.push(capital);
}

function clearCapitals() {
    capitals = [];
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
});