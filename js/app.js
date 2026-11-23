
import { renderDashboard } from "./pages/dashboard.js";
import { renderStudents } from "./pages/students.js";

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

function changePage(page) {
    const links = document.querySelectorAll(".nav-link");
    const headerTitle = document.getElementById("header-title");

    for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
    }

    const selectedLink = document.querySelector(`[data-page="${page}"]`);

    if (selectedLink) {
        selectedLink.classList.add("active");
    }

    if (page === "dashboard") {
        headerTitle.textContent = "📊 Dashboard";
        renderDashboard();
    } else if (page === "students") {
        headerTitle.textContent = "👨‍🎓 Students";
        renderStudents();
    } else {
        headerTitle.textContent = selectedLink.textContent.trim();

        document.getElementById("page-content").innerHTML = `
            <div class="dashboard-placeholder">
                <h3>${selectedLink.textContent.trim()}</h3>
                <p>This section will be implemented in a later commit.</p>
            </div>
        `;
    }
}

function initializeApp() {
    displayCurrentDate();

    const links = document.querySelectorAll(".nav-link");

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function(event) {
            event.preventDefault();

            const page = this.getAttribute("data-page");

            changePage(page);
        });
    }

    renderDashboard();
}

initializeApp();
