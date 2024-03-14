
const sourceSelect = document.getElementById("source-country");
const targetSelect = document.getElementById("target-country");

const sourceImg = document.getElementById("source-img");
const targetImg = document.getElementById("target-img");

const message = document.getElementById("message-box");

const button = document.getElementById("calculate-button");

let sourceCountry;
let targetCountry;


let sourcePPP;
let targetPPP;

let sourceSalary;
let targetSalary;










// Get references to input elements
const sourceInput = document.getElementById("source-input");
const targetInput = document.getElementById("target-input");

let targetvalue; //see target value declared outside 

// Add event listener to source input field
sourceInput.addEventListener("input", function () {
    const sourceValue = parseFloat(this.value); // Convert input value to a floating point number
    sourceSalary = sourceValue;
    console.log("Source input value:", sourceValue);
});

// Add event listener to target input field
targetInput.addEventListener("input", function () {
    const targetValue = parseFloat(this.value); // Convert input value to a floating point number
    console.log("Target input value:", targetValue);
    targetvalue = targetValue;
});


// Function to add options to a select tag
function addOptionsToSelect(selectId, options) {
    const selectElement = document.getElementById(selectId);
    for (const key in options) {
        if (options.hasOwnProperty(key)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = options[key];
            selectElement.appendChild(option);
        }
    }
}

// Call the function to add options to the source and target select boxes
addOptionsToSelect('source-country', countryList);
addOptionsToSelect('target-country', countryList);

console.log(countryList);

// Function to fetch and parse CSV file from GitHub
function fetchAndParseCSV(csvFileURL) {
    return fetch(csvFileURL)
        .then(response => response.text())
        .then(csvData => {
            // Split the CSV data into rows
            const rows = csvData.split('\n');
            // Initialize an empty array to store parsed data
            const data = [];
            // Loop through rows starting from the second row (index 1)
            for (let i = 0; i < rows.length; i++) {
                // Split each row into values
                const values = rows[i].split(',');
                if (values.length === 4) { // Ensure it has expected number of columns
                    // Extract the data
                    const country = values[0].replace(/"/g, '').trim();
                    const countryCode = values[1].replace(/"/g, '').trim();
                    const year = parseInt(values[2]);
                    const ppp = parseFloat(values[3]);
                    // Push to the data array
                    data.push({ country, countryCode, year, ppp });
                }
            }
            return data;
        });
}

// Function to get the PPP of the latest year for a given country code
function getLatestPPP(data, countryCode) {
    // Filter data for the desired country code
    const countryData = data.filter(entry => entry.countryCode === countryCode);
    if (countryData.length === 0) {
        return null; // Return null if no data found for the country code
    }
    // Sort the filtered data by year in descending order
    countryData.sort((a, b) => b.year - a.year);
    // Return the PPP of the latest year
    return countryData[0].ppp;
}

// Usage
const githubCSVFileURL = 'https://raw.githubusercontent.com/datasets/ppp/master/data/ppp-gdp.csv';

sourceSelect.addEventListener("change", function () {
    // Get the selected value from source select
    const sourceValue = this.value;
    console.log("Source Value:", sourceValue);

    const sourceText = this.options[this.selectedIndex].text;
    console.log("Source Text:", sourceText);
    sourceCountry = sourceText;
    console.log(sourceCountry);

    const countryCode = `${sourceCountry}`;

    fetchAndParseCSV(githubCSVFileURL)
        .then(data => {
            const latestPPP = getLatestPPP(data, countryCode);
            if (latestPPP !== null) {
                console.log(`Latest PPP for ${countryCode}: ${latestPPP}`);
                sourcePPP = latestPPP;
            } else {
                console.log(`No data found for country code ${countryCode}`);
            }
        })
        .catch(error => console.error('Error fetching or parsing CSV:', error));


    sourceImg.style.backgroundImage = `url(https://flagsapi.com/${sourceText}/flat/64.png)`;

});


// Add event listener to target select element
targetSelect.addEventListener("change", function () {
    // Get the selected value from target select
    const targetValue = this.value;
    console.log("Target Value:", targetValue);

    const TargetText = this.options[this.selectedIndex].text;
    console.log("Target Text:", TargetText);
    targetCountry = TargetText;

    const countryCode = `${targetCountry}`;

    fetchAndParseCSV(githubCSVFileURL)
        .then(data => {
            const latestPPP = getLatestPPP(data, countryCode);
            if (latestPPP !== null) {
                console.log(`Latest PPP for ${countryCode}: ${latestPPP}`);
                targetPPP = latestPPP;
            } else {
                console.log(`No data found for country code ${countryCode}`);
            }
        })
        .catch(error => console.error('Error fetching or parsing CSV:', error));


    targetImg.style.backgroundImage = `url(https://flagsapi.com/${TargetText}/flat/64.png)`;

});

button.addEventListener("click", function () {


    const actualPPP = targetPPP / sourcePPP;

    targetSalary = actualPPP * sourceSalary;

    targetInput.value = targetSalary;
    
    message.innerHTML = `Equivalent salary to have same living standard as source-country is : ${targetSalary}`;
    
    













});














