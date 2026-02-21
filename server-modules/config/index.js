// Digital-Clock

// server-modules/config/index.js

// Importing the sendInternalServerError function from the Response module
import { sendInternalServerError } from "../responses/index.js";

/**
 * Handle a request to read the file at the given pathname.
 * Generates a dynamic config.js file based on the DEBUG flag in the environment
 * @param {pathname} The path to the file to be read
 * @param {req} The request object
 * @param {res} The response object
 * @param {log} The logging function
 * @return {true} If the request was successful, false otherwise
 */
function handleConfigRequest({ pathname, req, res, log }) {
    // Only handle requests for /config.js
    if (pathname !== "/config.js") {
        return false;
    }

    // Log the receipt of the request
    log("debug", "Request for /config.js received, generating dynamic config.js");
    // Log the attempt to read the file
    log("info", `Attempting to read file: ${pathname}`);
    // Log the DEBUG flag status
    log("info", `Generating config.js with DEBUG=${process.env.DEBUG === "true" || false}`);
    
    // Generate the dynamic config.js content
    try {
        log("debug", "Serving dynamic config.js");

        const configJs = `
                    window.APP_CONFIG = {
                        DEBUG: ${process.env.DEBUG === "true"}
                    };
                `;

        res.writeHead(200, {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-store"
        });
        res.end(configJs);
        log("info", `Served ${pathname} with status 200`);
        return true;
    }
    // Handle any errors that occur during file generation
    catch (error) {
        log("error", `Error generating config.js: ${error.message}`);
        sendInternalServerError(res);
        return true;
    }
}

export { handleConfigRequest };