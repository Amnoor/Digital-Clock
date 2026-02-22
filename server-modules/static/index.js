// Digital-Clock

// server-modules/static/index.js

// Importing the fs module
import fs from "fs";
// Importing the path module
import path from "path";
// Importing MIME types mapping from the MIME module
import MIME_TYPES from "../mime/index.js";
// Importing response helper functions from the Responses module
import { sendNotFound, redirect } from "../responses/index.js";

/**
 * Redirects requests to /stopwatch to /stopwatch. This function handles cases where the user enters /stopwatch with a trailing slash.
 * @param {Object} options - An object containing the request pathname, response object, and logging function.
 * @param {String} options.pathname - The path of the requested file.
 * @param {Response} options.res - The HTTP response object.
 * @param {function} options.log - The logging function.
 * @returns {boolean} true if the request was handled, false otherwise.
 */
function handleStopwatchRedirect({ pathname, res, log }) {
    if (pathname !== "/stopwatch") {
        return false;
    }

    log("debug", "Redirecting /stopwatch to /stopwatch/");
    redirect(res, "/stopwatch/");
    return true;
}

/**
 * Resolves the file path for the requested resource.
 * @param {Object} options - An object containing the request pathname, project root, and logging function.
 * @param {String} options.pathname - The path of the requested file.
 * @param {String} options.projectRoot - The root directory of the project.
 * @param {function} options.log - The logging function.
 * @returns {Object} An object containing the resolved file path and status code.
 */
function resolveFilePath({ pathname, projectRoot, log }) {
    let filePath;
    let statusCode = 200;

    if (pathname === "/") {
        log("debug", "Root or home path requested, serving index.html");
        filePath = path.join(projectRoot, "index.html");
    }
    else if (pathname === "/stopwatch/") {
        log("debug", "Stopwatch path requested, serving stopwatch/index.html");
        filePath = path.join(projectRoot, "stopwatch", "index.html");
    }
    else {
        log("debug", `Static file requested: ${pathname}`);
        filePath = path.join(projectRoot, pathname.slice(1));
    }

    return { filePath, statusCode };
}

/**
 * Serves a static file from the given file path.
 * Logs debug information about the file path, extracted file extension, and determined content type.
 * Logs an error message if the file cannot be read, and sends a 404 or 500 response accordingly.
 * @param {Object} options - An object containing the file path, status code, request pathname, response object, logging function, and project root.
 * @param {String} options.filePath - The path of the file to be served.
 * @param {Number} options.statusCode - The HTTP status code to send.
 * @param {String} options.pathname - The path of the requested file.
 * @param {Response} options.res - The HTTP response object.
 * @param {function} options.log - The logging function.
 * @param {String} options.projectRoot - The root directory of the project.
 */
function serveFile({ filePath, statusCode, pathname, res, log, projectRoot }) {
    // Log the file path, extracted file extension, and determined content type for debugging purposes
    log("debug", `Determined file path: ${filePath}`);
    const ext = path.extname(filePath);
    log("debug", `Extracted file extension: ${ext}`);
    const contentType = MIME_TYPES[ext] || "text/plain";
    log("debug", `Determined content type: ${contentType}`);

    // Log the attempt to read the file
    log("info", `Attempting to read file: ${filePath}`);
    // Read the file and handle errors appropriately
    fs.readFile(filePath, (error, data) => {
        // if there is an error reading the file, log the error and send a 404 or 500 response based on the error code
        if (error) {
            log("error", `Error reading file ${filePath}: ${error.message}`);
            if (error.code === "ENOENT") {
                const resolvedStatusCode = 404;
                log("error", `File not found: ${filePath}, sending 404 response`);
                sendNotFound({ res, statusCode: resolvedStatusCode, projectRoot });
            }
            else if (error.code === "EACCES") {
                const resolvedStatusCode = 403;
                log("error", `Permission denied for file: ${filePath}, sending 403 response`);
                res.writeHead(resolvedStatusCode, { "Content-Type": "text/html; charset=utf-8" });
                res.end("<h1>403 Forbidden</h1>");
            }
            else if (error.code === "EPERM") {
                const resolvedStatusCode = 403;
                log("error", `Operation not permitted for file: ${filePath}, sending 403 response`);
                res.writeHead(resolvedStatusCode, { "Content-Type": "text/html; charset=utf-8" });
                res.end("<h1>403 Forbidden</h1>");
            }
            else if (error.code === "EISDIR") {
                const resolvedStatusCode = 404;
                log("error", `Attempted to read a directory as a file: ${filePath}, sending 404 response`);
                sendNotFound({ res, statusCode: resolvedStatusCode, projectRoot });
            }
            else if (error.code === "EMFILE") {
                const resolvedStatusCode = 500;
                log("error", `Too many open files: ${filePath}, sending 500 response`);
                res.writeHead(resolvedStatusCode, { "Content-Type": "text/html; charset=utf-8" });
                res.end("<h1>500 Service Unavailable</h1>");
            }
            else {
                const resolvedStatusCode = 500;
                log("error", `Unexpected error code ${error.code} for file: ${filePath}, sending 500 response`);
                res.writeHead(resolvedStatusCode, { "Content-Type": "text/html; charset=utf-8" });
                res.end("<h1>500 Internal Server Error</h1>");
            };
        }
        else {
            log("debug", `Successfully read file: ${filePath}`);
            res.writeHead(statusCode, {
                "Content-Type": contentType,
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "Referrer-Policy": "no-referrer"
            });
            res.end(data);
            log("info", `Served ${pathname} with status ${statusCode}`);
        }
    });
}

export { handleStopwatchRedirect, resolveFilePath, serveFile };
