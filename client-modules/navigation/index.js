// Digital-Clock

// client-modules/navigation/index.js

// Importing the log function from the logs module to enable logging within this navigation module
import log from '../logs/index.js';

/**
 * Sets up an event listener for the navigation button to toggle the menu when clicked.
 * If the menu is open and a click occurs outside both the menu and button, the menu is closed.
 * @returns {undefined}
 */
function navMenuOnClick() {
    // Get references to the navigation button and menu elements from the DOM
    const navButton = document.getElementById("nav-icon");
    const navMenu = document.getElementById("nav-menu");

    // Check if both the navigation button and menu exist in the DOM before proceeding
    if (!navButton || !navMenu) {
        log("error", "Navigation button or menu not found in the DOM.");
        return;
    }

    // Log a debug message indicating that the navigation button and menu were found and that the event listener is being set up
    log("debug", "Navigation button and menu found. Setting up event listener...");

    // Toggle menu when clicking the button
    navButton.addEventListener("click", (e) => {
        navMenu.classList.toggle("active");

        const expanded = navButton.getAttribute("aria-expanded") === "true";
        navButton.setAttribute("aria-expanded", String(!expanded));

        e.stopPropagation();
    });

    // Close menu when clicking anywhere outside the menu
    document.addEventListener("click", (e) => {
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnButton = navButton.contains(e.target);

        // If menu is open and click is outside both menu and button
        if (navMenu.classList.contains("active") && !isClickInsideMenu && !isClickOnButton) {
            navMenu.classList.remove("active");
            navButton.setAttribute("aria-expanded", "false");
        }
    });
}

// Exporting the navMenuOnClick function as the default export of this module, allowing it to be imported and used in other parts of the application
export default navMenuOnClick;