// Digital-Clock

// stopwatch/index.js

// Import the log function from the logs module
import log from "../client-modules/logs/index.js";
// Import the navMenuOnClick function from the navigation module
import navMenuOnClick from "../client-modules/navigation/index.js";
// Import the necessary elements and functions from the stopwatch module
import { startBtn, stopBtn, resetBtn, startStopwatch, stopStopwatch, resetStopwatch } from "../client-modules/stopwatch/index.js";

// Log initialization message
log("info", "Initializing Stopwatch Module...");

// logging debug message about setting up navigation menu functionality
log("debug", "Setting up navigation menu functionality...");
// Set up the navigation menu toggle functionality
navMenuOnClick()

// Attach event listeners to stopwatch buttons
startBtn.onclick = startStopwatch;
stopBtn.onclick = stopStopwatch;
resetBtn.onclick = resetStopwatch;

// Log successful initialization message
log("info", "Stopwatch Module initialized successfully.");