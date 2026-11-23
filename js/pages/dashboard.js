
import {
    students,
    courses,
    registrations,
    results,
    fees,
    books,
    borrowings
} from "../data/initialData.js";

export function renderDashboard() {
    const totalStudents = students.length;
    const totalCourses = courses.length;
    const totalRegistrations = registrations.length;

    const outstandingFees = fees.reduce(
        (sum, fee) => sum + Number(fee.balance || 0),
        0
    );

    const totalMarks = results.reduce(
        (sum, result) => sum + Number(result.total || 0),
        0
    );

    const averageMark = results.length > 0
        ? totalMarks / results.length
        : 0;

    const passedResults = results.filter(
        result => Number(result.total) >= 50
    ).length;

    const passRate = results.length > 0
        ? (passedResults / results.length) * 100
        : 0;

    const totalBooks = books.reduce(
        (sum, book) => sum + Number(book.copies || 0),
        0
    );

    const borrowedBooks = borrowings.filter(
        borrowing => borrowing.status === "Borrowed"
    ).length;

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
                    <h3>${outstandingFees.toLocaleString()} ETB</h3>
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
                    <span>Average Score</span>
                    <strong>${averageMark.toFixed(2)}%</strong>
                </div>

                <div class="overview-row">
                    <span>Pass Rate</span>
                    <strong>${passRate.toFixed(1)}%</strong>
                </div>

                <div class="overview-row">
                    <span>Library Copies</span>
                    <strong>${totalBooks}</strong>
                </div>

                <div class="overview-row">
                    <span>Currently Borrowed</span>
                    <strong>${borrowedBooks}</strong>
                </div>
            </div>

        </div>
    `;

    document.getElementById("reset-demo").addEventListener("click", function() {
        location.reload();
    });
}
