

function newGame(){
    // Reset Table
    document.getElementById("tableTitle").innerHTML = ""
    document.getElementById("thead").innerHTML = ""
    document.getElementById("tbody").innerHTML = ""

    // Restart guesses remaining
    document.getElementById("guesses").innerHTML = `5 Guesses Remaining!`

    // Randomly select target country index
    window.targetInd = Math.floor(Math.random() * 190)
    fetch('info.json')
    .then(response => response.json())
    .then(data => {
        console.log('Target Country:', data[0]['Name'][targetInd])
    })

    let dropdown = document.querySelector('.guess-box');
    dropdown.classList.toggle('hidden');
}


function init() {
    fetch('info.json')
    .then(response => response.json())
    .then(data => {

        // Creat Dropdown Options
        $(document).ready(function() {
            // Initialize Options
            const nameList = data[0]['nameList']
            countries = []
            for (let i = 0; i < nameList.length; i++) {
                countries.push({value: i, text: nameList[i]})
            }

            // Initialize Selectize
            $('#countryDropdown').selectize({
                options: countries,  // Dynamically add options
                labelField: 'text',  // The property to use as the display text
                valueField: 'value', // The property to use as the value
                searchField: 'text', // Enables search functionality
                create: false        // Disable adding new items manually
            });
        });

        let dropdown = document.querySelector('.guess-box');
        dropdown.classList.toggle('hidden');    
        
    })
}

// Initialize Dropdown 
init()


// Function for event listener
function optionChanged(newSample) {
    guess(newSample, targetInd)
}


// Build the metadata panel
function guess(guess, target) {
    fetch('info.json')
    .then(response => response.json())
    .then(data => {

        // Breaks out of function if dropdown option is deleted
        if(guess === ''){
            return
        }

        // Update guesses remianing header
        var numGuesses = document.getElementById("guessesTable").rows.length

        // if first guess, populate table headers
        if (numGuesses == 0){

            document.getElementById("tableTitle").innerHTML = `Guesses`

            const tableHead = document.getElementById("guessesTable").querySelector('thead');
            const newRow = tableHead.insertRow();
            
            const theaders = ['Guess', 'Country', 'Area', 'Direction', 'Population', 'Region', 'Subregion']
            for (const element of theaders) { // You can use `let` instead of `const` if you like
               newRow.insertCell().outerHTML = `<th>${element}</th>`;
           }
        }

        numGuesses = document.getElementById("guessesTable").rows.length

        if((5 - numGuesses) == 1){
            document.getElementById("guesses").innerHTML = `LAST GUESS!`
        }
        else{
            document.getElementById("guesses").innerHTML = `${5 - numGuesses} Guesses Remaining!`
        }

        // Display Guess
        const [key, value] = Object.entries(data[0]['Name']).find(([key, value]) => value === data[0]['Name'][guess]);
        differences(key, target)

        // Check if Won
        winLoss(guess, target, numGuesses)
    
    })
};


// Check if Won or Lost on Guess
function winLoss(guess, target, numGuesses){
    fetch('info.json')
    .then(response => response.json())
    .then(data => {
        // Check if Won
        if (parseInt(guess) === target){
            document.getElementById("guesses").innerHTML = `Play Again!`
            alert('You Won')
            score('W')
            reset()
        }
        // Check if Lost
        else if (numGuesses === 5){
            document.getElementById("guesses").innerHTML = `Play Again!`
            alert('You Lost')
            alert(`The country was ${data[0]['Name'][target]}`)
            score('L')
            reset()
        }
    })
}


function differences(guess, target){
    fetch('info.json')
    .then(response => response.json())
    .then(data => {

        // Select Table and Add New Row
        const table = document.getElementById("guessesTable");
        const tableBody = table.querySelector('tbody');
        const newRow = tableBody.insertRow();

        // Insert Differences into Table //

        // Guess Number
        newRow.insertCell().outerHTML = `<th>#${table.rows.length - 1}</th>`;

        // Name
        const cell2 = newRow.insertCell();
        cell2.textContent = data[0]['Name'][guess];


        let feat = data[0]['Features']

        // AREAS
        const cell3 = newRow.insertCell();
        let guessArea = feat[guess]['Area']
        let targetArea = feat[target]['Area']
        if (guessArea > targetArea){
            cell3.textContent = 'SMALLER'
        } 
        else{
            cell3.textContent = 'LARGER'
        }

        // LATITUDE LONGITUDE
        const cell4 = newRow.insertCell();
        let direction = ''
        let guesslatlng = feat[guess]['LatLng']
        let targetlatlng = feat[target]['LatLng']
        if (guesslatlng[0] > targetlatlng[0]){
            direction = 'S'
        } 
        else{
            direction = 'N'
        }

        if (guesslatlng[1] > targetlatlng[1]){
            direction += 'W'
        } 
        else{
            direction += 'E'
        }
        cell4.textContent = direction

        // POPULATION
        const cell7 = newRow.insertCell();
        let guessPop = feat[guess]['Population']
        let targetPop = feat[target]['Population']
        if (guessPop > targetPop){
            cell7.textContent = 'SMALLER'
        } 
        else{
            cell7.textContent = 'GREATER'
        }

        // REGION
        const cell5 = newRow.insertCell();
        const guessReg = feat[guess]['Region']
        const targetReg = feat[target]['Region']
        if (guessReg === targetReg){
            cell5.textContent = 'YES'
        } 
        else{
            cell5.textContent = 'NO'
        }

        // SUBREGION
        const cell6 = newRow.insertCell();
        let guessSubReg = feat[guess]['Subregion']
        let targetSubReg = feat[target]['Subregion']
        if (guessSubReg === targetSubReg){
            cell6.textContent = 'YES'
        } 
        else{
            cell6.textContent = 'NO'
        }

    })
}


function reset(){
    // Reset guesses remaining header
    document.getElementById("guesses").innerHTML = `Start a New Game!`

    // Hide dropdown menu //

    // let selectizeInstance = $('#countryDropdown')[0].selectize;
    // selectizeInstance.setValue('-');
    // selectizeInstance.clearOptions();
    // selectizeInstance.addOption({ value: "", text: "-" });

    // let dropdown = document.querySelector('.selectize-control');
    let dropdown = document.querySelector('.guess-box');
    dropdown.classList.toggle('hidden');
}


function score(wl){
    const headerElement = document.querySelector('#record'); // Select the header element
    const headerText = headerElement.textContent;
    const record = headerText.split("-")

    if (wl == 'W'){
        newWL = [parseInt(record[0])+1, record[1]]
    }
    else{
        newWL = [record[0], parseInt(record[1])+1]
    }

    document.getElementById("record").innerHTML = `${newWL[0]}-${newWL[1]}`
}


// END GOALS:

    // Page Opened:
        // Dropdown has only dash DONE
        // Button available to start game DONE

    // On New Game Button:
        // Select random country: DONE
        // Dropdown options available DONE

    // On Guess:
        // Guess Features Displayed DONE
        // Hints Displayed DONE
        // Guesses Remaining Displayed DONE

    // On Win / Loss:
        // Win / Loss Conditions Displayed
        // Dropdown has only dash
        // Prompts to start new game



// ORDER OF FUNCTIONS

    // Page Open
        // No functions called

    // Click New Game:
        // newGame()
            // Inits guesses remaining header
            // Selects target country
            // Calls init()

        // init()
            // Builds dropdown options

    // Dropdown Option Selected
        // optionChanged()
            // Calls guess

        // guess()
            // Updates guesses remianing header
            // Displays guess's features
            // Calls differences()
            // Checks if Won or Lost
                // If so:
                    // calls score()
                    // calls reset()
        
        // differences()
            // Displays differences

        // reset()
            // Updates guesses remaining header
            // Clears dropdown options

        
// TO FIX (Order of Importance)

    // Interface
        // Differences Symbols (checkmark, arrows, ...)
        // Button

    // country.json
        // Use updated data?
        // Check latlng is capital city
        // border abreviations
        // add remaining countries
        // alphabetize
        // Differentiate NA / SA
        // Look at subregions

    // CSS
