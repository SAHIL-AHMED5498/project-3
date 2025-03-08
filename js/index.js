const sourceSelect = document.getElementById("source-country");
const targetSelect = document.getElementById("target-country");
const sourceImg = document.getElementById("source-img");
const targetImg = document.getElementById("target-img");
const message = document.getElementById("message-box");
const button = document.getElementById("calculate-button");

const sourceInput = document.getElementById("source-input");
const targetInput = document.getElementById("target-input");

let sourcePPP, targetPPP;
let sourceSalary, targetSalary;

const githubCSVFileURL = 'https://raw.githubusercontent.com/datasets/ppp/master/data/ppp-gdp.csv';

// Store country names & codes
let countryDataMap = {};

// Fetch and parse CSV file
async function fetchAndParseCSV(csvFileURL) {
    const response = await fetch(csvFileURL);
    const csvData = await response.text();
    const rows = csvData.split('\n').slice(1); // Skip header

    rows.forEach(row => {
        const values = row.split(',');
        if (values.length === 4) {
            const country = values[0].replace(/"/g, '').trim();
            const countryCode = values[1].replace(/"/g, '').trim();
            const year = parseInt(values[2]);
            const ppp = parseFloat(values[3]);

            if (!countryDataMap[country]) {
                countryDataMap[country] = { code: countryCode, ppp: [] };
            }
            countryDataMap[country].ppp.push({ year, ppp });
        }
    });

    populateCountryDropdowns();
}

// Populate country dropdowns
function populateCountryDropdowns() {
    sourceSelect.innerHTML = '<option value="">Select source</option>';
    targetSelect.innerHTML = '<option value="">Select target</option>';

    Object.keys(countryDataMap)
        .sort()
        .forEach(country => addCountryToDropdown(country));
}

// Helper to add a country to dropdown
function addCountryToDropdown(country) {
    let option1 = document.createElement("option");
    let option2 = document.createElement("option");
    option1.value = country;
    option2.value = country;
    option1.textContent = country;
    option2.textContent = country;
    sourceSelect.appendChild(option1);
    targetSelect.appendChild(option2);
}

// Get latest PPP for a given country
function getLatestPPP(country) {
    if (!countryDataMap[country]) return null;
    const pppData = countryDataMap[country].ppp;
    pppData.sort((a, b) => b.year - a.year); // Sort by latest year
    return pppData[0].ppp;
}

// Handle selection changes
function handleCountryChange(selectElement, imgElement, isSource) {
    const country = selectElement.value;
    if (!countryDataMap[country]) return;

    const countryCode = countryDataMap[country].code;
    imgElement.style.backgroundImage = `url(https://flagsapi.com/${countryCode}/flat/64.png)`;
    imgElement.style.backgroundSize = "cover";
    imgElement.style.backgroundPosition = "center";
    imgElement.style.backgroundRepeat = "no-repeat";

    const ppp = getLatestPPP(country);
    if (isSource) {
        sourcePPP = ppp;
    } else {
        targetPPP = ppp;
    }
}

// Handle input
sourceInput.addEventListener("input", function () {
    sourceSalary = parseFloat(this.value);
});

// Button click event
button.addEventListener("click", function () {
    if (!sourcePPP || !targetPPP || !sourceSalary) {
        message.innerHTML = "⚠️ Please select both countries and enter a valid salary.";
        return;
    }

    const actualPPP = targetPPP / sourcePPP;
    targetSalary = actualPPP * sourceSalary;
    targetInput.value = targetSalary.toFixed(2);

    message.innerHTML = `You require a salary of ${targetSalary.toFixed(2)} in ${targetSelect.value}'s currency to match a salary of ${sourceSalary.toFixed(2)} in ${sourceSelect.value}'s currency.`;
});

// Event Listeners
sourceSelect.addEventListener("change", () => handleCountryChange(sourceSelect, sourceImg, true));
targetSelect.addEventListener("change", () => handleCountryChange(targetSelect, targetImg, false));

// Fetch data on load
fetchAndParseCSV(githubCSVFileURL);
