
import { courses } from "../data/initialData.js";
import { showModal, closeModal } from "../components/modal.js";

export function renderCourses() {
    const pageContent = document.getElementById("page-content");

    pageContent.innerHTML = `
        <div class="courses-page">
            <div class="page-heading">
                <div>
                    <h2>Course Management</h2>
                    <p>Manage academic courses and their information.</p>
                </div>

                <button class="add-course-btn" id="add-course-btn">
                    + Add Course
                </button>
            </div>

            <div class="courses-card">
                <div class="courses-toolbar">
                    <input
                        type="text"
                        id="course-search"
                        placeholder="Search courses..."
                    >

                    <select id="department-filter">
                        <option value="">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Information Systems">Information Systems</option>
                    </select>
                </div>

                <div class="courses-table-container">
                    <table class="courses-table">
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Department</th>
                                <th>Credit Hours</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="courses-table-body"></tbody>
                    </table>
                </div>

                <div class="courses-count" id="courses-count"></div>
            </div>
        </div>
    `;

    displayCourses(courses);

    document.getElementById("add-course-btn").addEventListener("click", function() {
        openCourseForm();
    });

    document.getElementById("course-search").addEventListener("input", filterCourses);

    document.getElementById("department-filter").addEventListener("change", filterCourses);
}

function displayCourses(courseList) {
    const tableBody = document.getElementById("courses-table-body");
    const count = document.getElementById("courses-count");

    tableBody.innerHTML = "";

    if (courseList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No courses found.
                </td>
            </tr>
        `;
    } else {
        courseList.forEach(function(course) {
            tableBody.innerHTML += `
                <tr>
                    <td>${course.code}</td>
                    <td>${course.name}</td>
                    <td>${course.department}</td>
                    <td>${course.credit}</td>
                    <td>
                        <button class="edit-course-btn" data-code="${course.code}">
                            Edit
                        </button>

                        <button class="delete-course-btn" data-code="${course.code}">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    count.textContent = `Showing ${courseList.length} course(s)`;

    addCourseActionButtons();
}

function filterCourses() {
    const searchValue = document.getElementById("course-search").value.toLowerCase();
    const departmentValue = document.getElementById("department-filter").value;

    const filteredCourses = courses.filter(function(course) {
        const matchesSearch =
            course.code.toLowerCase().includes(searchValue) ||
            course.name.toLowerCase().includes(searchValue) ||
            course.department.toLowerCase().includes(searchValue);

        const matchesDepartment =
            departmentValue === "" || course.department === departmentValue;

        return matchesSearch && matchesDepartment;
    });

    displayCourses(filteredCourses);
}

function addCourseActionButtons() {
    const editButtons = document.querySelectorAll(".edit-course-btn");
    const deleteButtons = document.querySelectorAll(".delete-course-btn");

    editButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            openCourseForm(button.dataset.code);
        });
    });

    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            deleteCourse(button.dataset.code);
        });
    });
}

function openCourseForm(courseCode = null) {
    const course = courseCode
        ? courses.find(function(item) {
            return item.code === courseCode;
        })
        : null;

    const title = course ? "Edit Course" : "Add Course";

    const formContent = `
        <form id="course-form">
            <div class="form-group">
                <label for="course-code">Course Code</label>
                <input
                    type="text"
                    id="course-code"
                    value="${course ? course.code : ""}"
                    placeholder="Example: CS301"
                    required
                    ${course ? "readonly" : ""}
                >
            </div>

            <div class="form-group">
                <label for="course-name">Course Name</label>
                <input
                    type="text"
                    id="course-name"
                    value="${course ? course.name : ""}"
                    placeholder="Enter course name"
                    required
                >
            </div>

            <div class="form-group">
                <label for="course-department">Department</label>
                <select id="course-department" required>
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Information Systems">Information Systems</option>
                </select>
            </div>

            <div class="form-group">
                <label for="course-credit">Credit Hours</label>
                <input
                    type="number"
                    id="course-credit"
                    value="${course ? course.credit : ""}"
                    min="1"
                    max="10"
                    required
                >
            </div>

            <div class="form-actions">
                <button type="button" class="cancel-btn" id="cancel-course-btn">
                    Cancel
                </button>

                <button type="submit" class="save-course-btn">
                    ${course ? "Update Course" : "Add Course"}
                </button>
            </div>
        </form>
    `;

    showModal(title, formContent);

    if (course) {
        document.getElementById("course-department").value = course.department;
    }

    document.getElementById("cancel-course-btn").addEventListener("click", closeModal);

    document.getElementById("course-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const code = document.getElementById("course-code").value.trim().toUpperCase();
        const name = document.getElementById("course-name").value.trim();
        const department = document.getElementById("course-department").value;
        const credit = Number(document.getElementById("course-credit").value);

        if (!code || !name || !department || credit < 1 || credit > 10) {
            alert("Please enter valid course information.");
            return;
        }

        if (course) {
            updateCourse(course.code, name, department, credit);
        } else {
            addCourse(code, name, department, credit);
        }
    });
}

function addCourse(code, name, department, credit) {
    const existingCourse = courses.find(function(course) {
        return course.code.toUpperCase() === code.toUpperCase();
    });

    if (existingCourse) {
        alert("A course with this code already exists.");
        return;
    }

    courses.push({
        code: code,
        name: name,
        department: department,
        credit: credit
    });

    closeModal();
    filterCourses();
    alert("Course added successfully.");
}

function updateCourse(code, name, department, credit) {
    const course = courses.find(function(item) {
        return item.code === code;
    });

    if (!course) {
        alert("Course not found.");
        return;
    }

    course.name = name;
    course.department = department;
    course.credit = credit;

    closeModal();
    filterCourses();
    alert("Course updated successfully.");
}

function deleteCourse(code) {
    const confirmed = confirm("Are you sure you want to delete this course?");

    if (!confirmed) {
        return;
    }

    const courseIndex = courses.findIndex(function(course) {
        return course.code === code;
    });

    if (courseIndex === -1) {
        alert("Course not found.");
        return;
    }

    courses.splice(courseIndex, 1);

    filterCourses();
    alert("Course deleted successfully.");
}
