// Digital-Clock

// client-modules/clock/index.js

// Import the log function from the logs module
import log from "../logs/index.js";

// Variable to store the current clock interval ID
let currentClockID = null;

/**
 * Starts the clock with the specified interval.
 * @param {number} toggle_mode - The clock format to use, either 24 or 12.
 * @param {number} [interval=1000] - The interval at which to update the clock.
 * @returns {void}
 */
function startClock(toggle_mode, interval = 1000) {
    // Get the clock element from the DOM
    const clock = document.getElementById("clock");

    /**
     * Updates the clock element with the current time based on the given time format.
     * If time_format is 24, the clock element's text content is updated with the 24 hour format.
     * If time_format is 12, the clock element's text content is updated with the 12 hour format.
     * @param {number} time_format - The clock format to use, either 24 or 12.
     * @returns {void}
     */
    function update(time_format){
        // Get the current date and time
        const now = new Date();

        // Extract hours
        const hours = now.getHours();
        // Extract minutes with leading zero
        const minutes = String(now.getMinutes()).padStart(2, "0");
        // Extract seconds with leading zero
        const seconds = String(now.getSeconds()).padStart(2, "0");
        // Initialize timeString variable to store formatted time
        let timeString = "";

        // If time_format is 12, format time in 12 hour format
        if(time_format === 12){
            log("debug", "Formatting time in 12 hour format.");
            const hours12 = String(hours % 12 || 12).padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            timeString = `${hours12}:${minutes}:${seconds} ${ampm}`;
        }
        // Else if time_format is 24, format time in 24 hour format
        else if(time_format === 24){
            log("debug", "Formatting time in 24 hour format.");
            const hours24 = String(hours).padStart(2, "0");
            timeString = `${hours24}:${minutes}:${seconds}`;
        }

        log("debug", `Current time: ${timeString}`);
        // Update the clock element's text content with the formatted time
        clock.textContent = timeString;
        log("debug", "Time formatted and displayed on clock element.");
        log("trace", `Current time string: ${timeString}`);
    }

    // If there is an existing clock interval, clear it
    if(currentClockID){
        clearInterval(currentClockID);
        log("info", "Cleared existing clock interval.");
    }
    // Else if there is no existing clock interval, log a debug message
    else if(!currentClockID){
        log("debug", "No existing clock interval found.");
    }
    // Else, log an error
    else{
        log("error", "Unexpected error checking existing clock interval.");
    }
    
    // If the clock element is not found, log an error
    if(!clock){
        log("error", "Clock element not found in the DOM.");
        return;
    }
    // else if the interval is less than or equal to 0, log an error
    else if(interval <= 0){
        log("error", "Interval must be greater than 0.");
        return;
    }
    // else start the clock and update it at the specified interval
    else if(toggle_mode === 24){
        // Log success message
        log("info", "Clock element found.");
        // Log starting message
        log("info", `Starting clock with an interval of ${interval} milliseconds.`);
        // Log 24 hour format message
        log("info", "Using 24 hour format.");
        // Initial
        update(toggle_mode);
        // Set interval to update the clock every specified milliseconds
        currentClockID = setInterval(() => update(toggle_mode), interval);
        return;
    }
    else if(toggle_mode === 12){
        // Log success message
        log("info", "Clock element found.");
        // Log starting message
        log("info", `Starting clock with an interval of ${interval} milliseconds.`);
        // Log 12 hour format message
        log("info", "Using 12 hour format.");
        // Initial
        update(toggle_mode);
        // Set interval to update the clock every specified milliseconds
        currentClockID = setInterval(() => update(toggle_mode), interval);
        return;
    };
};

// Export the startClock function
export{
    startClock
};