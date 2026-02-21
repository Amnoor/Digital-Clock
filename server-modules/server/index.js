// Digital-Clock

// server-modules/server/index.js

// Importing the log function from the Logs module
import log from "../logs/index.js";
// Importing the http module to create the server
import http from "http";

// Defining the port on which the server will listen
const PORT = process.env.PORT || 80;

/**
 * Starts an HTTP server that listens on the given port and uses the given handler.
 * @param {Function} handler - A function that will be used to handle incoming HTTP requests.
 * @returns {http.Server} - The created HTTP server.
 */
function startServer(handler) {
    // Creating the HTTP server using the http module
    const server = http.createServer(handler);

    // Starting the server and listening on the specified port
    server.listen(PORT, () => {
        log("info", `Server is running on port ${PORT}`);
    });

    // Returning the created server
    return server;
}

// Exporting the startServer function as the default export of this module
export default startServer;