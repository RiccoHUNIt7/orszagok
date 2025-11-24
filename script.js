const url = 'https://restcountries.com/v3.1/all?fields=name,capital,flags';

const waitTimeAfterAnswer = 3000;

const flagHolder = document.getElementById('flagImage');
const buttons = document.querySelectorAll('.button');

let countryList = [];

let currentCountryIndex = -1;
let prevousCountryIndex = -1;

let correctCapital = '';
let capitals = [];

let correctAnswers = 0;
let incorrectAnswers = 0;

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

    handleButtons();
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
        if (capitalAlreadyUsed(capital) || hasNoCapital(capital)) {
            continue;      
        }
        addUsedCapital(capital);
    }
}

function capitalAlreadyUsed(capital) {
    return capitals.includes(capital);
}

function hasNoCapital(capital) {
    return capital == undefined || capital === 'N/A';
}

function addUsedCapital(capital) {
    capitals.push(capital);
}

function clearCapitals() {
    capitals = [];
}

function handleButtons() {
    let buttonClicked = false;
    buttons.forEach((button, index) => {
        button.textContent = capitals[index];

        button.onclick = () => {
            if (buttonClicked) return;
            buttonClicked = true;
            if (button.textContent === correctCapital) {
                handleButtonColouring(button, true);
                correctAnswers++;
            } else {
                handleButtonColouring(button, false);
                incorrectAnswers++;
            }
            nextQuestion();
        }
    });
}

function handleButtonColouring(button, isCorrect) {
    if (isCorrect) {
        button.style.backgroundColor = 'green';
    } else {
        button.style.backgroundColor = 'red';
    }
}

function resetButtonColours() {
    buttons.forEach(button => {
        button.style.backgroundColor = '';
    });
}

function nextQuestion() {
    setTimeout(() => {
        resetButtonColours();
        loadQuestion();
    }, timeoutDuration = waitTimeAfterAnswer);

}

document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
});