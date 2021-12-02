
const usernameInput = document.querySelector('.search-div__input');
const searchButton = document.querySelector('.search_wrapper__button');
const username = document.querySelector('.name');
const userId = document.querySelector('.id');
const bio = document.querySelector('.bio__content');
const stats = document.getElementsByClassName('info__number');
const locationDiv = document.querySelector('.location');
const locationText = document.querySelector('.location > .item__text');
const blogDiv = document.querySelector('.webpage');
const blogUrl = document.querySelector('.webpage > .item__text');
const error = document.querySelector('.error');
const languageDiv = document.querySelector(".lang");
const language = document.querySelector(".lang > span");
const prediction_gender = document.querySelector('.prediction_gender');
const prediction_percentage = document.querySelector('.prediction_percentage');
const clear_cache = document.querySelector('.clear_cache');
const save_button = document.querySelector('.save_button');
const radio_button = document.querySelector('.radio_button');
const saved_answers = document.querySelector('.saved_answers');

// set focus in search bar. (we add focus class and the css handle it :)) )
function focusOnInputbar() {
    let parent = this.parentNode.parentNode;
    parent.classList.add('focus');
}

// remove focus class from search bar
function blurOnInputbar() {
    let parent = this.parentNode.parentNode;
    if (this.value == "")
        parent.classList.remove('focus');
}

// for handle status code error
function handleError(response) {
    showErrorMessage(response.message);
}

// displays each given message as an error message 
function showErrorMessage(message) {
    console.log(message);
    error.classList.add('active');
    error.innerHTML = message;
    setTimeout(() => { // removes the error message from screen after 4 seconds.
        error.classList.remove('active');
    }, 4000)
}

// get user data from API and return the json value.
async function getUserData(username) {
    console.log("request");
    try {
        let response = await fetch(`https://api.genderize.io/?name=${username}`)
        let json = await response.json();
        if (response.status == 200) {
            console.log("request2323");
            return json
        }
        handleError(json);
        return Promise.reject(`Request failed with error ${response.status}`);
    } catch (e) {
        showErrorMessage(e);
        console.log(e);
    }
}

// set name in view
function setName(userData) {
    prediction_gender.innerHTML = userData.gender;
    prediction_percentage.innerHTML = userData.probability;
}

// fill user data in view .
function fillProfileCard(userData) {
    console.log(userData);
    setName(userData);
}

 // remove the item from local storage based in input value
function clearCache() {
    const name = usernameInput.value;
    localStorage.removeItem(name);
}

// the process of sending data and fill it in view.
async function sendRequest(e) {
    console.log("clicked on submit");
    let username = usernameInput.value;
    if (!validateInput()) {
        console.log("username was empty");
        return;
    }
    e.preventDefault();
    let userData;
    
    userData = await getUserData(username);
    if (userData == null)
        return;
    fillProfileCard(userData);
}

// Saves the name in input and radio option in local storage
function saveGuess() {
    if(!validateInput) {
        handleError('Name should only include alphabet and space');
        return;
    }
    const name = usernameInput.value;
    const gender = radio_button.checked ? 'female' : 'male';
    localStorage.setItem(name, gender);
    console.log('Record saved to local storage.')
}

// check name validation
function validateInput() {
    const name = usernameInput.value;
    const regex = /^[a-zA-Z ]*$/;
    if(!name.match(regex) || name.length == 0) {
        handleError('Name should only include alphabet and space');
        return false;
    } else {
        return true;
    }
}

// Fetches data from local storage based on input and changes the value of saved answer
function fetchLocalStorage() {
    const name = usernameInput.value;
    const gender = localStorage.getItem(name) || 'Nothing to show';
    saved_answers.innerText = gender;
}


usernameInput.addEventListener('focus', focusOnInputbar);
usernameInput.addEventListener('blur', blurOnInputbar);
searchButton.addEventListener('click', sendRequest);
searchButton.addEventListener('click', fetchLocalStorage);
clear_cache.addEventListener('click', clearCache);
save_button.addEventListener('click', saveGuess);
