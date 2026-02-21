// Digital-Clock

// client-modules/logs/index.js

// Debugging flag
const DEBUG = window.APP_CONFIG?.DEBUG || false;

/**
 * Logs a message with a given type and timestamp.
 * If the type is not recognized, a warning message is logged.
 * If the type is recognized but not always logged, and the DEBUG constant is false,
 * the message is not logged.
 * @param {string} type - The type of the log message.
 * @param {string} message - The message to be logged.
 */
function log(type, message){
    // Get the current timestamp in ISO format
    const timestamp = new Date().toISOString();
    
    // Define log levels and their properties
    const level_type = {
        error: {console: console.error, always: true, label: "ERROR"},
        warn: {console: console.warn, always: true, label: "WARNING"},
        info: {console: console.info, always: true, label: "INFO"},
        log: {console: console.log, always: false, label: "LOG"},
        debug: {console: console.debug, always: false, label: "DEBUG"},
        trace: {console: console.trace, always: false, label: "TRACE"},
    }

    // Get the log level based on the type given
    const loglevel = level_type[type];

    // If the log level is invalid, log a warning message and return nothing
    if(!loglevel){
        console.warn(`[${timestamp}] [WARNING]: Invalid log type: ${type}`);
        return;
    }
    // Else if the log level is valid but not always logged, and DEBUG is false, return nothing
    else if(!loglevel.always && !DEBUG){
        return;
    }
    // Else, log the message with the appropriate log function
    else{
        loglevel.console(`[${timestamp}] [${loglevel.label}]: ${message}`);
    }
}

// Export the log function
export default log;