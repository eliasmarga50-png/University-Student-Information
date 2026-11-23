
import { students } from "../data/initialData.js";
import { showModal, closeModal } from "../components/modal.js";

export function renderStudents() {
    const pageContent = document.getElementById("page-content");

    pageContent.innerHTML = `
        <div class="students-page">

            <div class="students-title">
                <div>
                    <h2>Students</h2>
                    <p>Manage student records</p>
                </div>

                <button class="add-student-button" id="add-student">
                    + Add Student
                </button>
            </div>

            <div class="students-card">

                <div class="students-controls">

                    <input
                        type="text"
                        id="student-search"
                        placeholder="Search students..."
                    >

                    <select id="department-filter">
                        <option value="all">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Information Systems">Information Systems</option>
                    </select>

                </div>

                <div class="table-container">

                    <table class="students-table">

                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Full Name</th>
                                <th>Gender</th>
                                <th>Department</th>
                                <th>Year</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="students-table-body"></tbody>

                    </table>

                </div>

                <div class="students-count" id="students-count"></div>

            </div>

        </div>
    `;

    displayStudents(students);

    document.getElementById("add-student").addEventListener("click", function() {
        openStudentForm();
    });

    document.getElementById("student-search").addEventListener("input", function() {
        filterStudents();
    });

    document.getElementById("department-filter").addEventListener("change", function() {
        filterStudents();
    });
}

function displayStudents(studentList) {
    const tableBody = document.getElementById("students-table-body");
    const studentsCount = document.getElementById("students-count");

    tableBody.innerHTML = "";

    if (studentList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-students">
                    No students found.
                </td>
            </tr>
        `;
    } else {
        for (let i = 0; i < studentList.length; i++) {
            const student = studentList[i];

            tableBody.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.gender}</td>
                    <td>${student.department}</td>
                    <td>${student.year}</td>
                    <td>${student.email}</td>
                    <td>
                        <button class="edit-button" data-id="${student.id}">
                            Edit
                        </button>

                        <button class="delete-button" data-id="${student.id}">
                            Delete
                        </button>
                    </td>
                `;
        }
    }

    studentsCount.textContent = "Total Students: " + studentList.length;

    addActionButtons();
}

function filterStudents() {
    const searchValue = document.getElementById("student-search").value.toLowerCase();
    const departmentValue = document.getElementById("department-filter").value;

    const filteredStudents = students.filter(function(student) {
        const matchesSearch =
            student.name.toLowerCase().includes(searchValue) ||
            student.id.toLowerCase().includes(searchValue) ||
            student.email.toLowerCase().includes(searchValue);

        const matchesDepartment =
            departmentValue === "all" ||
            student.department === departmentValue;

        return matchesSearch && matchesDepartment;
    });

    displayStudents(filteredStudents);
}

function addActionButtons() {
    const editButtons = document.querySelectorAll(".edit-button");
    const deleteButtons = document.querySelectorAll(".delete-button");

    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener("click", function() {
            const studentId = this.getAttribute("data-id");
            openStudentForm(studentId);
        });
    }

    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", function() {
            const studentId = this.getAttribute("data-id");
            deleteStudent(studentId);
        });
    }
}

function openStudentForm(studentId = null) {
    let student = null;

    if (studentId !== null) {
        student = students.find(function(item) {
            return item.id === studentId;
        });
    }

    const isEditing = student !== null;

    const title = isEditing ? "Edit Student" : "Add Student";

    const formContent = `
        <form id="student-form">

            <div class="form-group">
                <label for="student-name">Full Name</label>
                <input
                    type="text"
                    id="student-name"
                    value="${student ? student.name : ""}"
                    placeholder="Enter full name"
                    required
                >
            </div>

            <div class="form-group">
                <label for="student-gender">Gender</label>
                <select id="student-gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male" ${student && student.gender === "Male" ? "selected" : ""}>Male</option>
                    <option value="Female" ${student && student.gender === "Female" ? "selected" : ""}>Female</option>
                </select>
            </div>

            <div class="form-group">
                <label for="student-department">Department</label>
                <select id="student-department" required>
                    <option value="">Select Department</option>
                    <option value="Computer Science" ${student && student.department === "Computer Science" ? "selected" : ""}>Computer Science</option>
                    <option value="Information Technology" ${student && student.department === "Information Technology" ? "selected" : ""}>Information Technology</option>
                    <option value="Software Engineering" ${student && student.department === "Software Engineering" ? "selected" : ""}>Software Engineering</option>
                    <option value="Information Systems" ${student && student.department === "Information Systems" ? "selected" : ""}>Information Systems</option>
                </select>
            </div>

            <div class="form-group">
                <label for="student-year">Year</label>
                <select id="student-year" required>
                    <option value="">Select Year</option>
                    <option value="Year 1" ${student && student.year === "Year 1" ? "selected" : ""}>Year 1</option>
                    <option value="Year 2" ${student && student.year === "Year 2" ? "selected" : ""}>Year 2</option>
                    <option value="Year 3" ${student && student.year === "Year 3" ? "selected" : ""}>Year 3</option>
                    <option value="Year 4" ${student && student.year === "Year 4" ? "selected" : ""}>Year 4</option>
                    <option value="Year 5" ${student && student.year === "Year 5" ? "selected" : ""}>Year 5</option>
                </select>
            </div>

            <div class="form-group">
                <label for="student-email">Email</label>
                <input
                    type="email"
                    id="student-email"
                    value="${student ? student.email : ""}"
                    placeholder="Enter email address"
                    required
                >
            </div>

            <div class="form-buttons">
                <button type="button" class="cancel-button" id="cancel-student">
                    Cancel
                </button>

                <button type="submit" class="save-button">
                    ${isEditing ? "Update Student" : "Add Student"}
                </button>
            </div>

        </form>
    `;

    showModal(title, formContent);

    document.getElementById("cancel-student").addEventListener("click", closeModal);

    document.getElementById("student-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("student-name").value.trim();
        const gender = document.getElementById("student-gender").value;
        const department = document.getElementById("student-department").value;
        const year = document.getElementById("student-year").value;
        const email = document.getElementById("student-email").value.trim();

        if (name.length < 2) {
            alert("Name must contain at least 2 characters.");
            return;
        }

        if (isEditing) {
            updateStudent(studentId, name, gender, department, year, email);
        } else {
            addStudent(name, gender, department, year, email);
        }

        closeModal();
        filterStudents();
    });
}

function generateStudentId() {
    let highestNumber = 0;

    for (let i = 0; i < students.length; i++) {
        const number = Number(students[i].id.replace("ST", ""));

        if (number > highestNumber) {
            highestNumber = number;
        }
    }

    return "ST" + String(highestNumber + 1).padStart(3, "0");
}

function addStudent(name, gender, department, year, email) {
    const newStudent = {
        id: generateStudentId(),
        name: name,
        gender: gender,
        department: department,
        year: year,
        email: email
    };

    students.push(newStudent);

    alert("Student added successfully.");
}

function updateStudent(studentId, name, gender, department, year, email) {
    const student = students.find(function(item) {
        return item.id === studentId;
    });

    if (student) {
        student.name = name;
        student.gender = gender;
        student.department = department;
        student.year = year;
        student.email = email;

        alert("Student updated successfully.");
    }
}

function deleteStudent(studentId) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (!confirmDelete) {
        return;
    }

    const studentIndex = students.findIndex(function(item) {
        return item.id === studentId;
    });

    if (studentIndex !== -1) {
        students.splice(studentIndex, 1);
    }

    filterStudents();

    alert("Student deleted successfully.");
}
