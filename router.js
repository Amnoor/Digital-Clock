// Digital-Clock

// router.js

// Importing the log function from the Logs module
import log from "./server-modules/logs/index.js";
// Importing the createRequestHandler function from the Router module
import createRequestHandler from "./server-modules/router/index.js";
// Importing the startServer function from the Server module
import startServer from "./server-modules/server/index.js";

// Logging an informational message to indicate that the server is being initialized
log("info", "Initializing the server...");

// Creating the request handler using the createRequestHandler function and passing the log function as an argument
const handler = createRequestHandler({ log });
// Starting the server by calling the startServer function and passing the handler as an argument
startServer(handler);