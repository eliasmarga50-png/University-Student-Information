

function displayCurrentDate() {
    const dateElement = document.getElementById("current-date");

    if (!dateElement) {
        return;
    }

    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    dateElement.textContent = formattedDate;
}

/**
 * Initialize the application.
 */
function initializeApp() {
    const pageContent = document.getElementById("page-content");
    const sidebar = document.getElementById("sidebar");

    if (!pageContent || !sidebar) {
        console.error("Application structure is incomplete.");
        return;
    }

    displayCurrentDate();

    console.log("Student Information System initialized.");
    console.log("Commit 1: Project setup completed.");
}

/**
 * Start the application after the HTML has loaded.
 */
initializeApp();
