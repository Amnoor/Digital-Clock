// Digital-Clock

// server-modules/responses/index.js

// Importing fs module
import fs from "fs";
// Importing path module
import path from "path";

/**
 * Sends a 500 Internal Server Error response to the client.
 * @param {Response} res The HTTP response object.
 */
function sendInternalServerError(res) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end("<h1>500 Internal Server Error</h1>");
}

/**
 * Sends a 404 Not Found response to the client.
 * @param {Response} res The HTTP response object.
 * @param {Number} statusCode The HTTP status code to send.
 * @param {String} projectRoot The root directory of the project.
 */
function sendNotFound({ res, statusCode, projectRoot }) {
    fs.readFile(path.join(projectRoot, "404.html"), (error404, page404) => {
        res.writeHead(statusCode, { "Content-Type": "text/html" });
        res.end(page404 || "<h1>404 Not Found</h1>");
    });
}

/**
 * Redirects the client to a different location.
 * @param {Response} res The HTTP response object.
 * @param {String} location The URL to redirect the client to.
 */
function redirect(res, location) {
    res.writeHead(301, { Location: location });
    res.end();
}

// Exporting the response functions
export { sendInternalServerError, sendNotFound, redirect };