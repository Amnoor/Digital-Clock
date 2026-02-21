// Digital-Clock

// client-modules/stopwatch/index.js

// Import the log function from the logs module
import log from "../logs/index.js";

// Get references to stopwatch display and buttons
const stopwatchDisplay = document.getElementById("stopwatch-display");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");
// Initialize stopwatch state
const currentTime = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
};
// Monotonic timing state
let startTimestamp = null;
let elapsedMs = 0;
let stopwatchRafId = null;

/**
 * Updates the stopwatch display based on the total elapsed time in milliseconds.
 * @param {number} totalMs - Total elapsed time in milliseconds.
 * @returns {void}
 */
function updateDisplay(totalMs){
    log("debug", "Updating stopwatch time.");
    const totalCentiseconds = Math.floor(totalMs / 10);
    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    currentTime.hours = hours;
    currentTime.minutes = minutes;
    currentTime.seconds = seconds;
    currentTime.milliseconds = centiseconds;

    log("debug", `Current Time - Hours: ${currentTime.hours}, Minutes: ${currentTime.minutes}, Seconds: ${currentTime.seconds}, Milliseconds: ${currentTime.milliseconds}`);
    stopwatchDisplay.textContent = `${String(currentTime.hours).padStart(2, '0')}:${String(currentTime.minutes).padStart(2, '0')}:${String(currentTime.seconds).padStart(2, '0')}.${String(currentTime.milliseconds).padStart(2, '0')}`;
    log("trace", `Stopwatch Display Updated: ${stopwatchDisplay.textContent}`);
}

/**
 * Starts the stopwatch by setting up an interval to update the time every 10 milliseconds.
 * If the stopwatch interval is already running, the function does nothing.
 * If the stopwatch interval is not running, the function logs a debug message and starts a new interval.
 * The function also defines a nested function updateTime which updates the stopwatch time and logs a debug message.
 * The function also logs a trace message after updating the stopwatch display.
 * @returns {void}
 */
function startStopwatch(){
    // Check if the stopwatch is already running
    if(stopwatchRafId){
        return;
    }

    // logging info message about starting the stopwatch
    log("info", "Stopwatch started.");
    log("debug", "Stopwatch not running, starting new RAF loop.");

    startTimestamp = performance.now();

    /**
     * Updates the stopwatch time based on elapsed monotonic time.
     * @returns {void}
     */
    function tick(){
        const totalMs = elapsedMs + (performance.now() - startTimestamp);
        updateDisplay(totalMs);
        stopwatchRafId = requestAnimationFrame(tick);
    }

    stopwatchRafId = requestAnimationFrame(tick);
};

function stopStopwatch(){
    if(!stopwatchRafId){
        return;
    }
    log("info", "Stopwatch stopped.");
    elapsedMs += performance.now() - startTimestamp;
    startTimestamp = null;
    cancelAnimationFrame(stopwatchRafId);
    stopwatchRafId = null;
}

function resetStopwatch(){
    log("info", "Stopwatch reset.");
    stopStopwatch();
    elapsedMs = 0;
    currentTime.hours = 0;
    currentTime.minutes = 0;
    currentTime.seconds = 0;
    currentTime.milliseconds = 0;
    updateDisplay(0);
}

export{
    startBtn,
    stopBtn,
    resetBtn,
    startStopwatch,
    stopStopwatch,
    resetStopwatch
};
