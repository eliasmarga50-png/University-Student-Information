
import { students, courses, registrations, attendance } from "../data/initialData.js";
import { showModal, closeModal } from "../components/modal.js";

export function renderAttendance() {
    const pageContent = document.getElementById("page-content");

    pageContent.innerHTML = `
        <div class="attendance-page">
            <div class="page-heading">
                <div>
                    <h2>Attendance Management</h2>
                    <p>Record and manage student attendance.</p>
                </div>
            </div>

            <div class="attendance-statistics">
                <div class="attendance-stat-card">
                    <div class="attendance-stat-icon total-icon">📋</div>
                    <div>
                        <p>Total Records</p>
                        <h3 id="total-attendance">0</h3>
                    </div>
                </div>

                <div class="attendance-stat-card">
                    <div class="attendance-stat-icon present-icon">✓</div>
                    <div>
                        <p>Present</p>
                        <h3 id="present-count">0</h3>
                    </div>
                </div>

                <div class="attendance-stat-card">
                    <div class="attendance-stat-icon absent-icon">✕</div>
                    <div>
                        <p>Absent</p>
                        <h3 id="absent-count">0</h3>
                    </div>
                </div>

                <div class="attendance-stat-card">
                    <div class="attendance-stat-icon late-icon">⌛</div>
                    <div>
                        <p>Late</p>
                        <h3 id="late-count">0</h3>
                    </div>
                </div>
            </div>

            <div class="attendance-card">
                <h3>Mark Attendance</h3>
                <p class="attendance-description">Record attendance for a registered student.</p>

                <form id="attendance-form">
                    <div class="attendance-form-grid">
                        <div class="form-group">
                            <label for="attendance-student">Student</label>
                            <select id="attendance-student" required>
                                <option value="">Select Student</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="attendance-course">Course</label>
                            <select id="attendance-course" required disabled>
                                <option value="">Select Course</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="attendance-date">Attendance Date</label>
                            <input type="date" id="attendance-date" required>
                        </div>

                        <div class="form-group">
                            <label for="attendance-status">Status</label>
                            <select id="attendance-status" required>
                                <option value="">Select Status</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="mark-attendance-btn">
                        Mark Attendance
                    </button>
                </form>
            </div>

            <div class="attendance-card">
                <div class="attendance-record-header">
                    <div>
                        <h3>Attendance Records</h3>
                        <p class="attendance-description">View and manage attendance history.</p>
                    </div>
                </div>

                <div class="attendance-toolbar">
                    <input
                        type="text"
                        id="attendance-search"
                        placeholder="Search student or course..."
                    >

                    <select id="attendance-filter-status">
                        <option value="">All Statuses</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                    </select>

                    <select id="attendance-filter-department">
                        <option value="">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Information Systems">Information Systems</option>
                    </select>
                </div>

                <div class="attendance-table-container">
                    <table class="attendance-table">
                        <thead>
                            <tr>
                                <th>Record ID</th>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="attendance-table-body"></tbody>
                    </table>
                </div>

                <div id="attendance-record-count" class="attendance-record-count"></div>
            </div>
        </div>
    `;

    populateAttendanceStudents();
    setDefaultAttendanceDate();
    displayAttendance(attendance);

    document.getElementById("attendance-student").addEventListener("change", populateStudentCourses);

    document.getElementById("attendance-form").addEventListener("submit", addAttendance);

    document.getElementById("attendance-search").addEventListener("input", filterAttendance);

    document.getElementById("attendance-filter-status").addEventListener("change", filterAttendance);

    document.getElementById("attendance-filter-department").addEventListener("change", filterAttendance);

    updateAttendanceStatistics();
}

function populateAttendanceStudents() {
    const studentDropdown = document.getElementById("attendance-student");

    students.forEach(function(student) {
        studentDropdown.innerHTML += `
            <option value="${student.id}">
                ${student.id} - ${student.name}
            </option>
        `;
    });
}

function populateStudentCourses() {
    const studentId = document.getElementById("attendance-student").value;
    const courseDropdown = document.getElementById("attendance-course");

    courseDropdown.innerHTML = `<option value="">Select Course</option>`;
    courseDropdown.disabled = true;

    if (!studentId) {
        return;
    }

    const studentRegistrations = registrations.filter(function(registration) {
        return registration.studentId === studentId;
    });

    studentRegistrations.forEach(function(registration) {
        const course = courses.find(function(item) {
            return item.code === registration.courseCode;
        });

        if (course) {
            courseDropdown.innerHTML += `
                <option value="${course.code}">
                    ${course.code} - ${course.name}
                </option>
            `;
        }
    });

    if (studentRegistrations.length > 0) {
        courseDropdown.disabled = false;
    } else {
        courseDropdown.innerHTML = `<option value="">Student has no registered courses</option>`;
    }
}

function setDefaultAttendanceDate() {
    const dateInput = document.getElementById("attendance-date");
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);

    dateInput.value = localDate.toISOString().split("T")[0];
}

function displayAttendance(attendanceList) {
    const tableBody = document.getElementById("attendance-table-body");
    const recordCount = document.getElementById("attendance-record-count");

    tableBody.innerHTML = "";

    if (attendanceList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="attendance-empty">
                    No attendance records found.
                </td>
            </tr>
        `;
    } else {
        attendanceList.forEach(function(record) {
            const student = students.find(function(item) {
                return item.id === record.studentId;
            });

            const course = courses.find(function(item) {
                return item.code === record.courseCode;
            });

            if (!student || !course) {
                return;
            }

            tableBody.innerHTML += `
                <tr>
                    <td>${record.id}</td>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${course.code} - ${course.name}</td>
                    <td>${record.date}</td>
                    <td>
                        <span class="attendance-status ${record.status.toLowerCase()}">
                            ${record.status}
                        </span>
                    </td>
                    <td>
                        <button class="edit-attendance-btn" data-id="${record.id}">
                            Edit
                        </button>

                        <button class="delete-attendance-btn" data-id="${record.id}">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    recordCount.textContent = `Showing ${attendanceList.length} record(s)`;

    addAttendanceActionButtons();
}

function filterAttendance() {
    const searchValue = document.getElementById("attendance-search").value.toLowerCase();
    const statusValue = document.getElementById("attendance-filter-status").value;
    const departmentValue = document.getElementById("attendance-filter-department").value;

    const filteredAttendance = attendance.filter(function(record) {
        const student = students.find(function(item) {
            return item.id === record.studentId;
        });

        const course = courses.find(function(item) {
            return item.code === record.courseCode;
        });

        if (!student || !course) {
            return false;
        }

        const matchesSearch =
            student.name.toLowerCase().includes(searchValue) ||
            student.id.toLowerCase().includes(searchValue) ||
            course.name.toLowerCase().includes(searchValue) ||
            course.code.toLowerCase().includes(searchValue);

        const matchesStatus = statusValue === "" || record.status === statusValue;

        const matchesDepartment =
            departmentValue === "" || course.department === departmentValue;

        return matchesSearch && matchesStatus && matchesDepartment;
    });

    displayAttendance(filteredAttendance);
}

function addAttendanceActionButtons() {
    const editButtons = document.querySelectorAll(".edit-attendance-btn");
    const deleteButtons = document.querySelectorAll(".delete-attendance-btn");

    editButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            editAttendance(button.dataset.id);
        });
    });

    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            deleteAttendance(button.dataset.id);
        });
    });
}

function addAttendance(event) {
    event.preventDefault();

    const studentId = document.getElementById("attendance-student").value;
    const courseCode = document.getElementById("attendance-course").value;
    const date = document.getElementById("attendance-date").value;
    const status = document.getElementById("attendance-status").value;

    if (!studentId || !courseCode || !date || !status) {
        alert("Please fill in all attendance fields.");
        return;
    }

    const duplicateRecord = attendance.find(function(record) {
        return record.studentId === studentId &&
            record.courseCode === courseCode &&
            record.date === date;
    });

    if (duplicateRecord) {
        alert("Attendance has already been recorded for this student, course, and date.");
        return;
    }

    attendance.push({
        id: generateAttendanceId(),
        studentId: studentId,
        courseCode: courseCode,
        date: date,
        status: status
    });

    document.getElementById("attendance-form").reset();

    setDefaultAttendanceDate();

    document.getElementById("attendance-course").innerHTML = `
        <option value="">Select Course</option>
    `;

    document.getElementById("attendance-course").disabled = true;

    filterAttendance();
    updateAttendanceStatistics();

    alert("Attendance recorded successfully.");
}

function generateAttendanceId() {
    let highestNumber = 0;

    attendance.forEach(function(record) {
        const number = Number(record.id.replace("ATT", ""));

        if (number > highestNumber) {
            highestNumber = number;
        }
    });

    return "ATT" + String(highestNumber + 1).padStart(3, "0");
}

function editAttendance(recordId) {
    const record = attendance.find(function(item) {
        return item.id === recordId;
    });

    if (!record) {
        alert("Attendance record not found.");
        return;
    }

    const formContent = `
        <form id="edit-attendance-form">
            <div class="form-group">
                <label>Student</label>
                <input value="${getStudentName(record.studentId)}" disabled>
            </div>

            <div class="form-group">
                <label>Course</label>
                <input value="${getCourseName(record.courseCode)}" disabled>
            </div>

            <div class="form-group">
                <label for="edit-attendance-date">Attendance Date</label>
                <input
                    type="date"
                    id="edit-attendance-date"
                    value="${record.date}"
                    required
                >
            </div>

            <div class="form-group">
                <label for="edit-attendance-status">Status</label>
                <select id="edit-attendance-status" required>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                </select>
            </div>

            <div class="form-actions">
                <button type="button" class="cancel-btn" id="cancel-attendance-edit">
                    Cancel
                </button>

                <button type="submit" class="save-course-btn">
                    Update Attendance
                </button>
            </div>
        </form>
    `;

    showModal("Edit Attendance", formContent);

    document.getElementById("edit-attendance-status").value = record.status;

    document.getElementById("cancel-attendance-edit").addEventListener("click", closeModal);

    document.getElementById("edit-attendance-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const newDate = document.getElementById("edit-attendance-date").value;
        const newStatus = document.getElementById("edit-attendance-status").value;

        const duplicateRecord = attendance.find(function(item) {
            return item.id !== recordId &&
                item.studentId === record.studentId &&
                item.courseCode === record.courseCode &&
                item.date === newDate;
        });

        if (duplicateRecord) {
            alert("Another attendance record already exists for this student, course, and date.");
            return;
        }

        record.date = newDate;
        record.status = newStatus;

        closeModal();
        filterAttendance();
        updateAttendanceStatistics();

        alert("Attendance updated successfully.");
    });
}

function getStudentName(studentId) {
    const student = students.find(function(item) {
        return item.id === studentId;
    });

    return student ? student.name : "Unknown Student";
}

function getCourseName(courseCode) {
    const course = courses.find(function(item) {
        return item.code === courseCode;
    });

    return course ? course.code + " - " + course.name : "Unknown Course";
}

function deleteAttendance(recordId) {
    const confirmed = confirm("Are you sure you want to delete this attendance record?");

    if (!confirmed) {
        return;
    }

    const recordIndex = attendance.findIndex(function(record) {
        return record.id === recordId;
    });

    if (recordIndex === -1) {
        alert("Attendance record not found.");
        return;
    }

    attendance.splice(recordIndex, 1);

    filterAttendance();
    updateAttendanceStatistics();

    alert("Attendance record deleted successfully.");
}

function updateAttendanceStatistics() {
    const total = attendance.length;

    const present = attendance.filter(function(record) {
        return record.status === "Present";
    }).length;

    const absent = attendance.filter(function(record) {
        return record.status === "Absent";
    }).length;

    const late = attendance.filter(function(record) {
        return record.status === "Late";
    }).length;

    document.getElementById("total-attendance").textContent = total;
    document.getElementById("present-count").textContent = present;
    document.getElementById("absent-count").textContent = absent;
    document.getElementById("late-count").textContent = late;
}
