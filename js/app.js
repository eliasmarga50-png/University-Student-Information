
function displayCurrentDate() {
    const dateElement = document.getElementById("current-date");

    const today = new Date();

    const date = today.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    dateElement.textContent = date;
}

function initializeApp() {
    displayCurrentDate();
}

initializeApp();
