
import { renderDashboard } from "./pages/dashboard.js";
import { renderStudents } from "./pages/students.js";
import { renderCourses } from "./pages/courses.js";
import { renderRegistration } from "./pages/registration.js";

const pageTitles = {
    dashboard: "Dashboard",
    students: "Students",
    courses: "Courses",
    registration: "Course Registration",
    attendance: "Attendance",
    results: "Results & Grades",
    fees: "Fees Management",
    library: "Library Management",
    reports: "Reports"
};

function changePage(page) {
    const pageContent = document.getElementById("page-content");
    const headerTitle = document.getElementById("header-title");

    document.querySelectorAll(".nav-link").forEach(function(link) {
        link.classList.remove("active");
    });

    const activeLink = document.querySelector(`[data-page="${page}"]`);

    if (activeLink) {
        activeLink.classList.add("active");
    }

    headerTitle.textContent = pageTitles[page] || "Student Information System";

    if (page === "dashboard") {
        renderDashboard();
    } else if (page === "students") {
        renderStudents();
    } else if (page === "courses") {
        renderCourses();
    } else if (page === "registration") {
        renderRegistration();
    } else {
        pageContent.innerHTML = `
            <div class="dashboard-placeholder">
                <h2>${pageTitles[page]}</h2>
                <p>This section will be implemented in a future step.</p>
            </div>
        `;
    }
}

function initializeApp() {
    const currentDate = document.getElementById("current-date");

    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    document.querySelectorAll(".nav-link").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const page = link.dataset.page;

            changePage(page);
        });
    });

    renderDashboard();
}

initializeApp();
