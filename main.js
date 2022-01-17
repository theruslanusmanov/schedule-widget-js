import  './src/calendar.js';

const date = new Date();
const dateElement = document.getElementById('date');
dateElement.innerText = date.toDateString();
