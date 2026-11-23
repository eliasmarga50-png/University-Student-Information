
import { students, courses, registrations, results, fees } from "../data/initialData.js";

export function renderDashboard() {
    const totalStudents = students.length;
    const totalCourses = courses.length;
    const totalRegistrations = registrations.length;

    let outstandingFees = 0;

    for (let i = 0; i < fees.length; i++) {
        outstandingFees += fees[i].amount - fees[i].paid;
    }

    let totalMarks = 0;

    for (let i = 0; i < results.length; i++) {
        totalMarks += results[i].mark;
    }

    let averageMark = 0;

    if (results.length > 0) {
        averageMark = totalMarks / results.length;
    }

    let passedStudents = 0;

    for (let i = 0; i < results.length; i++) {
        if (results[i].mark >= 50) {
            passedStudents++;
        }
    }

    let passRate = 0;

    if (results.length > 0) {
        passRate = (passedStudents / results.length) * 100;
    }

    const recentStudents = students.slice().reverse().slice(0, 5);

    const pageContent = document.getElementById("page-content");

    pageContent.innerHTML = `
        <div class="page-title">
            <h2>Dashboard</h2>

            <button class="reset-button" id="reset-demo">
                Reset Demo Data
            </button>
        </div>

        <div class="summary-cards">

            <div class="summary-card">
                <div class="summary-icon">👨‍🎓</div>
                <div class="summary-info">
                    <p>Total Students</p>
                    <h3>${totalStudents}</h3>
                </div>
            </div>

            <div class="summary-card">
                <div class="summary-icon">📚</div>
                <div class="summary-info">
                    <p>Total Courses</p>
                    <h3>${totalCourses}</h3>
                </div>
            </div>

            <div class="summary-card">
                <div class="summary-icon">📝</div>
                <div class="summary-info">
                    <p>Registrations</p>
                    <h3>${totalRegistrations}</h3>
                </div>
            </div>

            <div class="summary-card">
                <div class="summary-icon">💰</div>
                <div class="summary-info">
                    <p>Outstanding Fees</p>
                    <h3>$${outstandingFees.toFixed(2)}</h3>
                </div>
            </div>

        </div>

        <div class="dashboard-sections">

            <div class="dashboard-card">
                <h3>Recent Students</h3>

                <div class="recent-students">
                    ${recentStudents.map(student => `
                        <div class="student-row">
                            <span>${student.name}</span>
                            <span>${student.id}</span>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="dashboard-card">
                <h3>Academic Overview</h3>

                <div class="overview-row">
                    <span>Results Recorded</span>
                    <strong>${results.length}</strong>
                </div>

                <div class="overview-row">
                    <span>Average Mark</span>
                    <strong>${averageMark.toFixed(2)}</strong>
                </div>

                <div class="overview-row">
                    <span>Pass Rate</span>
                    <strong>${passRate.toFixed(1)}%</strong>
                </div>
            </div>

        </div>
    `;

    const resetButton = document.getElementById("reset-demo");

    resetButton.addEventListener("click", function() {
        location.reload();
    });
}
