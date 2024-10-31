const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date'); 
const timezoneSelect = document.getElementById('timezone-select');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const exitFullscreenBtn = document.getElementById('exit-fullscreen-btn');
const amBtn = document.getElementById('am-btn');
const pmBtn = document.getElementById('pm-btn');
const quoteElement = document.getElementById('quote'); // Reference for the quote element


const quotes = [
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Time flies over us, but leaves its shadow behind.",
    "Time is what we want most, but what we use worst.",
    "The future depends on what you do today.",
    "Don’t watch the clock; do what it does. Keep going.",
    "The two most powerful warriors are patience and time.",
    "Time is a created thing. To say 'I don't have time,' is like saying, 'I don't want to.'",
    "Time is the wisest counselor of all.",
    "Time is the most valuable thing a man can spend.",
    "Time is money."
];
const calendarIcon = document.getElementById('calendar-icon');
const calendarContainer = document.getElementById('calendar-container');

calendarIcon.addEventListener('click', function() {
    calendarIcon.classList.toggle('active');
    if (calendarIcon.classList.contains('active')) {
        calendarContainer.style.display = 'block';
    } else {
        calendarContainer.style.display = 'none';
    }
});


// Function to update the time, date, and background based on the selected time zone
function updateClock() {
    const now = new Date();
    const timezone = timezoneSelect.value;

    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: timezone };
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: timezone };
 function showNotification(title, body) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body });
            }
        });
    }
}

// Example usage: notify at the start of a new hour
if (new Date().getMinutes() === 0) {
    showNotification('New Hour', 'It is now a new hour!');
}


    // Time formatting
    const timeFormatter = new Intl.DateTimeFormat('en-GB', timeOptions);
    const timeParts = timeFormatter.formatToParts(now);

    const hours = timeParts.find(part => part.type === 'hour').value;
    const minutes = timeParts.find(part => part.type === 'minute').value;
    const seconds = timeParts.find(part => part.type === 'second').value;
    const period = timeParts.find(part => part.type === 'dayPeriod').value; 

    const dateFormatter = new Intl.DateTimeFormat('en-GB', dateOptions);
    const formattedDate = dateFormatter.format(now);

    const newTime = `${hours}:${minutes}:${seconds} ${period}`;
    if (newTime !== timeElement.innerHTML) {
        timeElement.innerHTML = newTime;
    }

    dateElement.innerHTML = `Date: ${formattedDate}`;

    if (period === 'AM') {
        amBtn.style.display = 'block'; 
        pmBtn.style.display = 'none';  
    } else {
        amBtn.style.display = 'none';  
        pmBtn.style.display = 'block'; 
    }

    changeBackgroundBasedOnTime(parseInt(hours), period);
}



// Function to change background color based on the time of day
function changeBackgroundBasedOnTime(hours, period) {
    let backgroundColor;

    if (period === 'AM' && hours >= 6 && hours < 12) {
        backgroundColor = '#FFD700'; 
    } else if (period === 'PM' && hours >= 12 && hours < 18) {
        backgroundColor = '#87CEEB'; 
    } else if (period === 'PM' && hours >= 18 && hours < 20) {
        backgroundColor = '#FF4500'; 
    } else {
        backgroundColor = '#2F4F4F'; 
    }

    document.body.style.backgroundColor = backgroundColor;
}

// Function to update the quote
function updateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.innerHTML = `"${quotes[randomIndex]}"`; // Update quote
}

// Event listeners for fullscreen buttons
fullscreenBtn.addEventListener('click', enterFullscreen);
exitFullscreenBtn.addEventListener('click', exitFullscreen);

// Enter fullscreen mode
function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
    hideElements();
}

// Exit fullscreen mode
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    showElements();
}

// Hide unnecessary elements in fullscreen mode
function hideElements() {
    timezoneSelect.style.display = 'none';
    fullscreenBtn.style.display = 'none';
    exitFullscreenBtn.style.display = 'none'; // Hide exit fullscreen button
    stopwatchcontainer.style.display = 'none';
}

// Show necessary elements when exiting fullscreen
function showElements() {
    timezoneSelect.style.display = 'block';
    fullscreenBtn.style.display = 'block';
    exitFullscreenBtn.style.display = 'none'; // Hide exit fullscreen button
    stopwatchcontainerBtn.style.display = 'block';

}

// Add mousemove event to show exit fullscreen button
document.addEventListener('mousemove', () => {
    if (document.fullscreenElement) {
        exitFullscreenBtn.style.display = 'block'; // Show exit fullscreen button when mouse moves
    } else {
        exitFullscreenBtn.style.display = 'none'; // Hide exit fullscreen button
    }
});

// Add mouseleave event to hide exit fullscreen button
document.addEventListener('mouseleave', () => {
    if (document.fullscreenElement) {
        exitFullscreenBtn.style.display = 'none'; // Hide when mouse leaves the window
    }
});

// Update the clock every second
setInterval(updateClock, 1000);
setInterval(updateQuote, 10000); // Update quote every 10 seconds
updateClock(); // Initial call to display time and date immediately
updateQuote(); // Initial call to display a quote

// Enter fullscreen mode and apply fullscreen styling
function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }

    // Add the fullscreen-mode class to the body
    document.body.classList.add('fullscreen-mode');
    hideElements();
}

// Exit fullscreen mode and remove fullscreen styling
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }

    // Remove the fullscreen-mode class from the body
    document.body.classList.remove('fullscreen-mode');
    showElements();
}

let startTime;
let updatedTime;
let difference;
let timerInterval;
let running = false;

const display = document.getElementById("display");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

function startTimer() {
    if (!running) {
        running = true;
        startTime = new Date().getTime() - (difference || 0);
        timerInterval = setInterval(updateTime, 1000);
        stopButton.disabled = false;
        resetButton.disabled = false;
        startButton.disabled = true;
    }
}

function stopTimer() {
    running = false;
    clearInterval(timerInterval);
    startButton.disabled = false;
    stopButton.disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    running = false;
    difference = 0;
    display.innerHTML = "00:00:00";
    startButton.disabled = false;
    stopButton.disabled = true;
    resetButton.disabled = true;
}

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    display.innerHTML = (hours < 10 ? "0" : "") + hours + ":" + 
                        (minutes < 10 ? "0" : "") + minutes + ":" + 
                        (seconds < 10 ? "0" : "") + seconds;
}
