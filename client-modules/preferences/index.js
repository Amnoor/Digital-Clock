// Digital-Clock

// client-client-modules/preferences/index.js

// Import the log function from the logs module
import log from "../logs/index.js";
// Import the startClock function from the clock module
import { startClock } from "../clock/index.js";

// Get the format toggle input element from the DOM
const toggleInput = document.getElementById("format-toggle");
// Store the clock mode in localStorage
const savedMode = localStorage.getItem("clockMode");

/**
 * Loads the saved clock mode from client-side storage and starts the clock accordingly.
 * If savedMode is "24", sets the toggle input to checked and starts the clock in 24 hour mode.
 * If savedMode is "12", sets the toggle input to unchecked and starts the clock in 12 hour mode.
 * If savedMode is null or undefined, defaults to starting the clock in 12 hour mode.
 * Logs debug messages when loading the saved mode from client-side storage and when starting the clock in the corresponding mode.
 * Logs a trace message with the saved mode retrieved from client-side storage.
 */
function loadSavedMode(){
    if(!toggleInput){
        log("warn", "Format toggle not found; skipping saved clock mode load.");
        return;
    }
    log("debug", "Loading saved clock mode from client-side storage...");
    // if savedMode is "24", set the toggle input to checked and start the clock in 24 hour mode
    if(savedMode === "24"){
        log("debug", "Found client-side save: Loading 24h mode.");
        toggleInput.checked = true;
        startClock(24);
        log("trace", `Saved mode retrieved: ${savedMode}`);
        return;
    }
    // else if savedMode is "12", set the toggle input to unchecked and start the clock in 12 hour mode
    else if(savedMode === "12" || !savedMode){
        log("debug", "Found client-side save: Loading 12h mode.");
        toggleInput.checked = false;
        startClock(12);
        log("trace", `Saved mode retrieved: ${savedMode}`);
        return;
    }
}

/**
 * Adds an event listener to the toggle input for changes.
 * If the toggle input is checked, starts the clock in 24 hour mode and saves the mode to client-side storage.
 * If the toggle input is unchecked, starts the clock in 12 hour mode and saves the mode to client-side storage.
 * If an unexpected toggle input state is encountered, logs an error.
 */
function listenForModeChanges(){
    if(!toggleInput){
        log("warn", "Format toggle not found; skipping mode change listener.");
        return;
    }
    // Add event listener to the toggle input for changes
    toggleInput.addEventListener("change", (info) => {
        // If the toggle input is checked, start the clock in 24 hour mode
        if(info.target.checked){
            log("debug", "Switching to 24 hour format.");
            localStorage.setItem("clockMode", "24");
            startClock(24);
            log("trace", `Toggled to ${info.target.checked}`);
        }
        // Else, start the clock in 12 hour mode
        else if(!info.target.checked){
            log("debug", "Switching to 12 hour format.");
            localStorage.setItem("clockMode", "12");
            startClock(12);
            log("trace", `Toggled to ${info.target.checked}`);
        }
        // Else, log an error
        else{
            log("error", "Unexpected toggle input state.");
            log("trace", `Toggled to ${info.target.checked}`);
        }
    });
}

// Export the functions to be used in other modules
export{
    loadSavedMode,
    listenForModeChanges
};
