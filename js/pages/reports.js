
import {
    students,
    courses,
    registrations,
    attendance,
    results,
    fees,
    books,
    borrowings
} from "../data/initialData.js";

export function renderReports() {
    const pageContent = document.getElementById("page-content");

    const totalStudents = students.length;
    const totalCourses = courses.length;
    const totalRegistrations = registrations.length;
    const totalResults = results.length;

    const averageScore = totalResults > 0
        ? results.reduce((sum, result) => sum + Number(result.total || 0), 0) / totalResults
        : 0;

    const passedResults = results.filter(result => Number(result.total) >= 50).length;
    const failedResults = results.filter(result => Number(result.total) < 50).length;

    const passRate = totalResults > 0
        ? (passedResults / totalResults) * 100
        : 0;

    const totalExpectedFees = fees.reduce((sum, fee) => sum + Number(fee.feeAmount || 0), 0);
    const totalCollectedFees = fees.reduce((sum, fee) => sum + Number(fee.paidAmount || 0), 0);
    const totalOutstandingFees = fees.reduce((sum, fee) => sum + Number(fee.balance || 0), 0);

    const totalBookCopies = books.reduce((sum, book) => sum + Number(book.copies || 0), 0);
    const availableBookCopies = books.reduce((sum, book) => sum + Number(book.available || 0), 0);
    const borrowedBookCopies = borrowings.filter(item => item.status === "Borrowed").length;

    const presentRecords = attendance.filter(record => record.status === "Present").length;
    const absentRecords = attendance.filter(record => record.status === "Absent").length;
    const lateRecords = attendance.filter(record => record.status === "Late").length;

    const attendanceTotal = attendance.length;

    const attendanceRate = attendanceTotal > 0
        ? (presentRecords / attendanceTotal) * 100
        : 0;

    const departments = [...new Set(students.map(student => student.department))];

    pageContent.innerHTML = `
        <div class="reports-page">

            <div class="reports-intro">
                <div>
                    <h2>System Reports</h2>
                    <p>Overview of academic, financial, student, and library activities.</p>
                </div>

                <button id="export-reports-btn" class="export-report-btn">
                    Export Student Report
                </button>
            </div>

            <div class="reports-section">
                <h3>Student & Academic Overview</h3>

                <div class="report-stat-grid">
                    <div class="report-stat-card">
                        <span class="report-stat-icon">👨‍🎓</span>
                        <div>
                            <p>Total Students</p>
                            <h3>${totalStudents}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">📚</span>
                        <div>
                            <p>Total Courses</p>
                            <h3>${totalCourses}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">📝</span>
                        <div>
                            <p>Registrations</p>
                            <h3>${totalRegistrations}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">📑</span>
                        <div>
                            <p>Results Recorded</p>
                            <h3>${totalResults}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="reports-section">
                <h3>Academic Performance</h3>

                <div class="report-stat-grid">
                    <div class="report-stat-card">
                        <span class="report-stat-icon">📊</span>
                        <div>
                            <p>Average Score</p>
                            <h3>${averageScore.toFixed(2)}%</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">✅</span>
                        <div>
                            <p>Passed Results</p>
                            <h3>${passedResults}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">❌</span>
                        <div>
                            <p>Failed Results</p>
                            <h3>${failedResults}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">🎯</span>
                        <div>
                            <p>Pass Rate</p>
                            <h3>${passRate.toFixed(1)}%</h3>
                        </div>
                    </div>
                </div>

                <div class="report-detail-card">
                    <h4>Grade Distribution</h4>
                    <div id="grade-distribution"></div>
                </div>
            </div>

            <div class="reports-section">
                <h3>Attendance Overview</h3>

                <div class="report-stat-grid">
                    <div class="report-stat-card">
                        <span class="report-stat-icon">🗓️</span>
                        <div>
                            <p>Attendance Records</p>
                            <h3>${attendanceTotal}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">🟢</span>
                        <div>
                            <p>Present</p>
                            <h3>${presentRecords}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">🔴</span>
                        <div>
                            <p>Absent</p>
                            <h3>${absentRecords}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">🟡</span>
                        <div>
                            <p>Late</p>
                            <h3>${lateRecords}</h3>
                        </div>
                    </div>
                </div>

                <div class="report-detail-card">
                    <h4>Attendance Rate</h4>
                    <div class="report-progress-track">
                        <div class="report-progress-fill" style="width: ${attendanceRate}%"></div>
                    </div>
                    <strong>${attendanceRate.toFixed(1)}% Present</strong>
                    <p>Percentage of recorded attendance marked Present.</p>
                </div>
            </div>

            <div class="reports-section">
                <h3>Financial Overview</h3>

                <div class="report-stat-grid">
                    <div class="report-stat-card">
                        <span class="report-stat-icon">💰</span>
                        <div>
                            <p>Total Expected</p>
                            <h3>${totalExpectedFees.toLocaleString()} ETB</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">💵</span>
                        <div>
                            <p>Collected</p>
                            <h3>${totalCollectedFees.toLocaleString()} ETB</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">📉</span>
                        <div>
                            <p>Outstanding</p>
                            <h3>${totalOutstandingFees.toLocaleString()} ETB</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">🧾</span>
                        <div>
                            <p>Fee Records</p>
                            <h3>${fees.length}</h3>
                        </div>
                    </div>
                </div>

                <div class="report-detail-card">
                    <h4>Fee Collection Progress</h4>
                    <div class="report-progress-track">
                        <div class="report-progress-fill" style="width: ${totalExpectedFees > 0 ? (totalCollectedFees / totalExpectedFees) * 100 : 0}%"></div>
                    </div>
                    <strong>${totalExpectedFees > 0 ? ((totalCollectedFees / totalExpectedFees) * 100).toFixed(1) : "0.0"}% Collected</strong>
                    <p>Collected payments compared with total expected fees.</p>
                </div>
            </div>

            <div class="reports-section">
                <h3>Library Overview</h3>

                <div class="report-stat-grid">
                    <div class="report-stat-card">
                        <span class="report-stat-icon">📚</span>
                        <div>
                            <p>Book Titles</p>
                            <h3>${books.length}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">📖</span>
                        <div>
                            <p>Total Copies</p>
                            <h3>${totalBookCopies}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">🟢</span>
                        <div>
                            <p>Available</p>
                            <h3>${availableBookCopies}</h3>
                        </div>
                    </div>

                    <div class="report-stat-card">
                        <span class="report-stat-icon">📕</span>
                        <div>
                            <p>Currently Borrowed</p>
                            <h3>${borrowedBookCopies}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="reports-section">
                <div class="department-report-header">
                    <div>
                        <h3>Department Report</h3>
                        <p>Student count and academic performance by department.</p>
                    </div>

                    <select id="report-department-filter">
                        <option value="all">All Departments</option>
                        ${departments.map(department => `
                            <option value="${escapeReportHTML(department)}">${escapeReportHTML(department)}</option>
                        `).join("")}
                    </select>
                </div>

                <div class="report-table-container">
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Students</th>
                                <th>Registrations</th>
                                <th>Results</th>
                                <th>Average Score</th>
                                <th>Pass Rate</th>
                            </tr>
                        </thead>

                        <tbody id="department-report-body"></tbody>
                    </table>
                </div>
            </div>

            <div class="reports-section">
                <div class="department-report-header">
                    <div>
                        <h3>Student Summary Report</h3>
                        <p>Student registrations, academic scores, attendance, and balances.</p>
                    </div>

                    <input
                        type="text"
                        id="student-report-search"
                        placeholder="Search students..."
                    >
                </div>

                <div class="report-table-container">
                    <table class="report-table student-report-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Registrations</th>
                                <th>Average Score</th>
                                <th>Attendance</th>
                                <th>Fee Balance</th>
                            </tr>
                        </thead>

                        <tbody id="student-report-body"></tbody>
                    </table>
                </div>

                <div id="student-report-count" class="report-record-count"></div>
            </div>
        </div>
    `;

    renderGradeDistribution();
    renderDepartmentReport();
    renderStudentReport();

    document.getElementById("report-department-filter").addEventListener("change", renderDepartmentReport);
    document.getElementById("student-report-search").addEventListener("input", renderStudentReport);
    document.getElementById("export-reports-btn").addEventListener("click", exportStudentReport);
}

function renderGradeDistribution() {
    const container = document.getElementById("grade-distribution");

    const grades = ["A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];

    const gradeCounts = grades.map(grade => ({
        grade,
        count: results.filter(result => result.grade === grade).length
    }));

    container.innerHTML = grades.map(grade => {
        const count = gradeCounts.find(item => item.grade === grade).count;
        const percentage = results.length > 0 ? (count / results.length) * 100 : 0;

        return `
            <div class="grade-distribution-row">
                <span class="grade-distribution-label">${grade}</span>
                <div class="grade-distribution-track">
                    <div class="grade-distribution-fill" style="width: ${percentage}%"></div>
                </div>
                <strong>${count}</strong>
            </div>
        `;
    }).join("");
}

function renderDepartmentReport() {
    const tbody = document.getElementById("department-report-body");
    const filter = document.getElementById("report-department-filter").value;

    const departments = [...new Set(students.map(student => student.department))];

    const filteredDepartments = filter === "all"
        ? departments
        : departments.filter(department => department === filter);

    tbody.innerHTML = "";

    filteredDepartments.forEach(department => {
        const departmentStudents = students.filter(student => student.department === department);
        const studentIds = departmentStudents.map(student => student.id);

        const departmentRegistrations = registrations.filter(
            registration => studentIds.includes(registration.studentId)
        );

        const departmentResults = results.filter(
            result => studentIds.includes(result.studentId)
        );

        const average = departmentResults.length > 0
            ? departmentResults.reduce((sum, result) => sum + Number(result.total || 0), 0) / departmentResults.length
            : 0;

        const passed = departmentResults.filter(result => Number(result.total) >= 50).length;

        const passRate = departmentResults.length > 0
            ? (passed / departmentResults.length) * 100
            : 0;

        tbody.innerHTML += `
            <tr>
                <td>${escapeReportHTML(department)}</td>
                <td>${departmentStudents.length}</td>
                <td>${departmentRegistrations.length}</td>
                <td>${departmentResults.length}</td>
                <td>${average.toFixed(2)}%</td>
                <td>${passRate.toFixed(1)}%</td>
            </tr>
        `;
    });

    if (filteredDepartments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="report-empty">No departments found.</td>
            </tr>
        `;
    }
}

function renderStudentReport() {
    const tbody = document.getElementById("student-report-body");
    const search = document.getElementById("student-report-search").value.toLowerCase();

    const filteredStudents = students.filter(student => {
        return student.name.toLowerCase().includes(search) ||
            student.id.toLowerCase().includes(search) ||
            student.department.toLowerCase().includes(search);
    });

    tbody.innerHTML = "";

    filteredStudents.forEach(student => {
        const studentRegistrations = registrations.filter(
            registration => registration.studentId === student.id
        );

        const studentResults = results.filter(
            result => result.studentId === student.id
        );

        const studentAttendance = attendance.filter(
            record => record.studentId === student.id
        );

        const studentFees = fees.find(fee => fee.studentId === student.id);

        const averageScore = studentResults.length > 0
            ? studentResults.reduce((sum, result) => sum + Number(result.total || 0), 0) / studentResults.length
            : 0;

        const presentCount = studentAttendance.filter(
            record => record.status === "Present"
        ).length;

        const attendanceRate = studentAttendance.length > 0
            ? (presentCount / studentAttendance.length) * 100
            : 0;

        const feeBalance = studentFees ? Number(studentFees.balance || 0) : 0;

        tbody.innerHTML += `
            <tr>
                <td>${escapeReportHTML(student.id)}</td>
                <td>${escapeReportHTML(student.name)}</td>
                <td>${escapeReportHTML(student.department)}</td>
                <td>${studentRegistrations.length}</td>
                <td>${averageScore.toFixed(2)}%</td>
                <td>${studentAttendance.length > 0 ? attendanceRate.toFixed(1) + "%" : "—"}</td>
                <td>${feeBalance.toLocaleString()} ETB</td>
            </tr>
        `;
    });

    if (filteredStudents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="report-empty">No students found.</td>
            </tr>
        `;
    }

    document.getElementById("student-report-count").textContent =
        `Showing ${filteredStudents.length} of ${students.length} students`;
}

function exportStudentReport() {
    const rows = [
        [
            "Student ID",
            "Student Name",
            "Department",
            "Registrations",
            "Average Score",
            "Attendance Rate",
            "Fee Balance"
        ]
    ];

    students.forEach(student => {
        const studentRegistrations = registrations.filter(
            registration => registration.studentId === student.id
        );

        const studentResults = results.filter(
            result => result.studentId === student.id
        );

        const studentAttendance = attendance.filter(
            record => record.studentId === student.id
        );

        const studentFees = fees.find(fee => fee.studentId === student.id);

        const averageScore = studentResults.length > 0
            ? studentResults.reduce((sum, result) => sum + Number(result.total || 0), 0) / studentResults.length
            : 0;

        const presentCount = studentAttendance.filter(
            record => record.status === "Present"
        ).length;

        const attendanceRate = studentAttendance.length > 0
            ? (presentCount / studentAttendance.length) * 100
            : 0;

        rows.push([
            student.id,
            student.name,
            student.department,
            studentRegistrations.length,
            averageScore.toFixed(2),
            studentAttendance.length > 0 ? attendanceRate.toFixed(1) + "%" : "No records",
            studentFees ? studentFees.balance : 0
        ]);
    });

    const csvContent = rows.map(row =>
        row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const file = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-summary-report.csv";
    link.click();

    URL.revokeObjectURL(url);
}

function escapeReportHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return replacements[character];
    });
}
