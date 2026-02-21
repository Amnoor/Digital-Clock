// Digital-Clock

// server-modules/paths/index.js

// Importing the url module
import url from "url";
// Importing the path module
import path from "path";

// Defining constants for module directory name and project root
const MODULE_DIRNAME = path.dirname(url.fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(MODULE_DIRNAME, "..", "..");

/**
 * Parse the request URL to extract the host and requested path.
 * @param {IncomingMessage} req - The request object containing the HTTP request headers and URL.
 * @returns {URL} The parsed URL object containing the host and requested path.
 */
function parseRequestUrl(req) {
    const host = req.headers.host?.trim() || "localhost";
    const requestPath = req.url || "/";
    return new URL(requestPath, `http://${host}`);
};

// Exporting the PROJECT_ROOT constant and parseRequestUrl function
export { PROJECT_ROOT, parseRequestUrl };