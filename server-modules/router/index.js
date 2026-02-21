// Digital-Clock

// server-modules/router/index.js

// Importing the constant PROJECT_ROOT and the parseRequestUrl function from the Paths module
import { PROJECT_ROOT, parseRequestUrl } from "../paths/index.js";
// Importing the handleConfigRequest function from the Config module
import { handleConfigRequest } from "../config/index.js";
// Importing functions related to static file handling from the Static module
import { handleStopwatchRedirect, resolveFilePath, serveFile } from "../static/index.js";
// Importing the sendInternalServerError function from the Responses module
import { sendInternalServerError } from "../responses/index.js";

/**
 * Creates a request handler function that serves static files, handles redirects to the stopwatch, and handles config requests.
 * @param {Object} options - An object containing the log function to be used for logging.
 * @param {function} options.log - The log function to be used for logging.
 * @returns {function} - A request handler function that serves static files, handles redirects to the stopwatch, and handles config requests.
 */
function createRequestHandler({ log }) {
    return (req, res) => {
        // Logging request details
        log("info", `Received request: ${req.method} ${req.url}`);
        log("info", `Request from ${req.socket.remoteAddress}:${req.socket.remotePort}`);
        log("info", "attempting to serve static file");

        // Wrapping the request handling logic in a try-catch block to handle unexpected errors
        try {
            // Logging the URL being parsed
            log("debug", `Parsing URL: ${req.url}`);
            // Parsing the request URL
            const parsedUrl = parseRequestUrl(req);
            const pathname = parsedUrl.pathname;

            // Logging the parsed pathname
            log("info", `Received request for ${pathname}`);

            // Handling config requests
            if (handleConfigRequest({ pathname, req, res, log })) {
                return;
            }

            // Handling stopwatch redirect requests
            if (handleStopwatchRedirect({ pathname, res, log })) {
                return;
            }

            // Resolving the file path for the requested resource
            const { filePath, statusCode } = resolveFilePath({
                pathname,
                projectRoot: PROJECT_ROOT,
                log
            });

            // Serving the requested static file
            serveFile({
                filePath,
                statusCode,
                pathname,
                res,
                log,
                projectRoot: PROJECT_ROOT
            });
        }
        // Handling unexpected errors
        catch (error) {
            log("error", `Unexpected error: ${error.message}`);
            sendInternalServerError(res);
        };
    };
};

// Exporting the createRequestHandler function as the default export of the module
export default createRequestHandler;