let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let running = false;

const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const recordBtn = document.getElementById('record');
const recordsList = document.getElementById('records-list');
const darkModeCheckbox = document.getElementById('dark-mode');

// Load saved records from localStorage
let lapRecords = JSON.parse(localStorage.getItem('laps')) || [];
updateRecordList();

// Load dark mode preference
if(localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
    darkModeCheckbox.checked = true;
}

function formatTime(time) {
    let milliseconds = time % 1000;
    let totalSeconds = Math.floor(time / 1000);
    let seconds = totalSeconds % 60;
    let totalMinutes = Math.floor(totalSeconds / 60);
    let minutes = totalMinutes % 60;
    let hours = Math.floor(totalMinutes / 60);

    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}.${milliseconds.toString().padStart(3,'0')}`;
}

function startTimer() {
    if (!running) {
        running = true;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            timeDisplay.textContent = formatTime(elapsedTime);
        }, 10); // update every 10ms
    }
}

function pauseTimer() {
    running = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    elapsedTime = 0;
    timeDisplay.textContent = "00:00:00.000";
    lapRecords = [];
    localStorage.removeItem('laps');
    updateRecordList();
}

function recordTime() {
    lapRecords.unshift(formatTime(elapsedTime)); // latest on top
    localStorage.setItem('laps', JSON.stringify(lapRecords));
    updateRecordList();
}

function updateRecordList() {
    recordsList.innerHTML = '';
    lapRecords.forEach((lap, index) => {
        const li = document.createElement('li');
        li.textContent = `Lap ${lapRecords.length - index}: ${lap}`;
        recordsList.appendChild(li);
    });
}

// Dark mode toggle
darkModeCheckbox.addEventListener('change', () => {
    if(darkModeCheckbox.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('darkMode', 'disabled');
    }
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
recordBtn.addEventListener('click', recordTime);