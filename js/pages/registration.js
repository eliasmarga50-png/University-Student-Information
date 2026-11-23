
import { students, courses, registrations } from "../data/initialData.js";

export function renderRegistration() {
    const pageContent = document.getElementById("page-content");

    pageContent.innerHTML = `
        <div class="registration-page">
            <div class="page-heading">
                <div>
                    <h2>Course Registration</h2>
                    <p>Register students for available courses.</p>
                </div>
            </div>

            <div class="registration-card">
                <h3>Register Student</h3>

                <form id="registration-form">
                    <div class="registration-form-grid">
                        <div class="form-group">
                            <label for="registration-student">Select Student</label>
                            <select id="registration-student" required>
                                <option value="">Choose a student</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="registration-course">Select Course</label>
                            <select id="registration-course" required>
                                <option value="">Choose a course</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="register-btn">
                        Register Student
                    </button>
                </form>
            </div>

            <div class="registration-card">
                <div class="registration-header">
                    <div>
                        <h3>Registered Courses</h3>
                        <p>View and manage student course registrations.</p>
                    </div>
                </div>

                <div class="registration-toolbar">
                    <input
                        type="text"
                        id="registration-search"
                        placeholder="Search student or course..."
                    >

                    <select id="registration-department-filter">
                        <option value="">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Information Systems">Information Systems</option>
                    </select>
                </div>

                <div class="registration-table-container">
                    <table class="registration-table">
                        <thead>
                            <tr>
                                <th>Registration ID</th>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Department</th>
                                <th>Credits</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody id="registration-table-body"></tbody>
                    </table>
                </div>

                <div class="registration-count" id="registration-count"></div>
            </div>
        </div>
    `;

    populateStudentDropdown();
    populateCourseDropdown();
    displayRegistrations(registrations);

    document.getElementById("registration-form").addEventListener("submit", registerStudent);

    document.getElementById("registration-search").addEventListener("input", filterRegistrations);

    document.getElementById("registration-department-filter").addEventListener("change", filterRegistrations);
}

function populateStudentDropdown() {
    const studentDropdown = document.getElementById("registration-student");

    students.forEach(function(student) {
        studentDropdown.innerHTML += `
            <option value="${student.id}">
                ${student.id} - ${student.name}
            </option>
        `;
    });
}

function populateCourseDropdown() {
    const courseDropdown = document.getElementById("registration-course");

    courses.forEach(function(course) {
        courseDropdown.innerHTML += `
            <option value="${course.code}">
                ${course.code} - ${course.name} (${course.credit} Credits)
            </option>
        `;
    });
}

function displayRegistrations(registrationList) {
    const tableBody = document.getElementById("registration-table-body");
    const count = document.getElementById("registration-count");

    tableBody.innerHTML = "";

    if (registrationList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="registration-empty">
                    No registrations found.
                </td>
            </tr>
        `;
    } else {
        registrationList.forEach(function(registration) {
            const student = students.find(function(item) {
                return item.id === registration.studentId;
            });

            const course = courses.find(function(item) {
                return item.code === registration.courseCode;
            });

            if (!student || !course) {
                return;
            }

            tableBody.innerHTML += `
                <tr>
                    <td>${registration.id}</td>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${course.code}</td>
                    <td>${course.name}</td>
                    <td>${course.department}</td>
                    <td>${course.credit}</td>
                    <td>
                        <button
                            class="remove-registration-btn"
                            data-id="${registration.id}"
                        >
                            Remove
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    count.textContent = `Showing ${registrationList.length} registration(s)`;

    addRegistrationActionButtons();
}

function filterRegistrations() {
    const searchValue = document.getElementById("registration-search").value.toLowerCase();
    const departmentValue = document.getElementById("registration-department-filter").value;

    const filteredRegistrations = registrations.filter(function(registration) {
        const student = students.find(function(item) {
            return item.id === registration.studentId;
        });

        const course = courses.find(function(item) {
            return item.code === registration.courseCode;
        });

        if (!student || !course) {
            return false;
        }

        const matchesSearch =
            student.name.toLowerCase().includes(searchValue) ||
            student.id.toLowerCase().includes(searchValue) ||
            course.name.toLowerCase().includes(searchValue) ||
            course.code.toLowerCase().includes(searchValue);

        const matchesDepartment =
            departmentValue === "" || course.department === departmentValue;

        return matchesSearch && matchesDepartment;
    });

    displayRegistrations(filteredRegistrations);
}

function addRegistrationActionButtons() {
    const removeButtons = document.querySelectorAll(".remove-registration-btn");

    removeButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            removeRegistration(button.dataset.id);
        });
    });
}

function registerStudent(event) {
    event.preventDefault();

    const studentId = document.getElementById("registration-student").value;
    const courseCode = document.getElementById("registration-course").value;

    if (!studentId || !courseCode) {
        alert("Please select both a student and a course.");
        return;
    }

    const existingRegistration = registrations.find(function(registration) {
        return registration.studentId === studentId &&
            registration.courseCode === courseCode;
    });

    if (existingRegistration) {
        alert("This student is already registered for this course.");
        return;
    }

    const newRegistration = {
        id: generateRegistrationId(),
        studentId: studentId,
        courseCode: courseCode
    };

    registrations.push(newRegistration);

    document.getElementById("registration-form").reset();

    filterRegistrations();

    alert("Student registered successfully.");
}

function generateRegistrationId() {
    let highestNumber = 0;

    registrations.forEach(function(registration) {
        const number = Number(registration.id.replace("REG", ""));

        if (number > highestNumber) {
            highestNumber = number;
        }
    });

    return "REG" + String(highestNumber + 1).padStart(3, "0");
}

function removeRegistration(registrationId) {
    const confirmed = confirm("Are you sure you want to remove this registration?");

    if (!confirmed) {
        return;
    }

    const registrationIndex = registrations.findIndex(function(registration) {
        return registration.id === registrationId;
    });

    if (registrationIndex === -1) {
        alert("Registration not found.");
        return;
    }

    registrations.splice(registrationIndex, 1);

    filterRegistrations();

    alert("Registration removed successfully.");
}
