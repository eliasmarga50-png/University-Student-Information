
import { renderDashboard } from "./pages/dashboard.js";
import { renderStudents } from "./pages/students.js";
import { renderCourses } from "./pages/courses.js";
import { renderRegistration } from "./pages/registration.js";
import { renderAttendance } from "./pages/attendance.js";
import { renderResults } from "./pages/results.js";
import { renderFees } from "./pages/fees.js";
import { renderLibrary } from "./pages/library.js";
import { renderReports } from "./pages/reports.js";

const pageTitles = {
    dashboard: "Dashboard",
    students: "Student Management",
    courses: "Course Management",
    registration: "Course Registration",
    attendance: "Attendance Management",
    results: "Results & Grades",
    fees: "Fees Management",
    library: "Library Management",
    reports: "Reports & Analytics"
};

function changePage(page) {
    const headerTitle = document.getElementById("header-title");

    headerTitle.textContent = pageTitles[page] || "Dashboard";

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");

        if (link.dataset.page === page) {
            link.classList.add("active");
        }
    });

    switch (page) {
        case "dashboard":
            renderDashboard();
            break;

        case "students":
            renderStudents();
            break;

        case "courses":
            renderCourses();
            break;

        case "registration":
            renderRegistration();
            break;

        case "attendance":
            renderAttendance();
            break;

        case "results":
            renderResults();
            break;

        case "fees":
            renderFees();
            break;

        case "library":
            renderLibrary();
            break;

        case "reports":
            renderReports();
            break;

        default:
            renderDashboard();
    }
}

function initializeApp() {
    const dateElement = document.getElementById("current-date");

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const page = this.dataset.page;

            if (page) {
                changePage(page);
            }
        });
    });

    renderDashboard();
}

initializeApp();
