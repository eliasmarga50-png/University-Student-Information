
import { students, courses, registrations, results } from "../data/initialData.js";
import { showModal, closeModal } from "../components/modal.js";

export function renderResults() {
    const pageContent = document.getElementById("page-content");

    pageContent.innerHTML = `
        <div class="results-page">
            <div class="page-heading">
                <div>
                    <h2>Results & Grade Management</h2>
                    <p>Manage student scores and academic performance.</p>
                </div>
            </div>

            <div class="results-statistics">
                <div class="result-stat-card">
                    <div class="result-stat-icon total-result-icon">📋</div>
                    <div>
                        <p>Total Results</p>
                        <h3 id="total-results">0</h3>
                    </div>
                </div>

                <div class="result-stat-card">
                    <div class="result-stat-icon average-result-icon">📊</div>
                    <div>
                        <p>Average Score</p>
                        <h3 id="average-score">0%</h3>
                    </div>
                </div>

                <div class="result-stat-card">
                    <div class="result-stat-icon pass-result-icon">✓</div>
                    <div>
                        <p>Passed</p>
                        <h3 id="passed-count">0</h3>
                    </div>
                </div>

                <div class="result-stat-card">
                    <div class="result-stat-icon fail-result-icon">✕</div>
                    <div>
                        <p>Failed</p>
                        <h3 id="failed-count">0</h3>
                    </div>
                </div>
            </div>

            <div class="results-card">
                <h3>Enter Student Results</h3>
                <p class="results-description">
                    Assignment: 20 points, Midterm: 30 points, Final Exam: 50 points.
                </p>

                <form id="result-form">
                    <div class="results-form-grid">
                        <div class="form-group">
                            <label for="result-student">Student</label>
                            <select id="result-student" required>
                                <option value="">Select Student</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="result-course">Course</label>
                            <select id="result-course" required disabled>
                                <option value="">Select Course</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="assignment-score">Assignment (20)</label>
                            <input
                                type="number"
                                id="assignment-score"
                                min="0"
                                max="20"
                                step="0.1"
                                placeholder="0 - 20"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label for="midterm-score">Midterm (30)</label>
                            <input
                                type="number"
                                id="midterm-score"
                                min="0"
                                max="30"
                                step="0.1"
                                placeholder="0 - 30"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label for="final-score">Final Exam (50)</label>
                            <input
                                type="number"
                                id="final-score"
                                min="0"
                                max="50"
                                step="0.1"
                                placeholder="0 - 50"
                                required
                            >
                        </div>
                    </div>

                    <div class="result-preview" id="result-preview">
                        <div>
                            <p>Total Score</p>
                            <h3 id="preview-total">0 / 100</h3>
                        </div>

                        <div>
                            <p>Grade</p>
                            <h3 id="preview-grade">-</h3>
                        </div>

                        <div>
                            <p>Grade Point</p>
                            <h3 id="preview-point">0.0</h3>
                        </div>
                    </div>

                    <button type="submit" class="save-result-btn">
                        Save Result
                    </button>
                </form>
            </div>

            <div class="results-card">
                <div class="results-table-header">
                    <div>
                        <h3>Academic Results</h3>
                        <p class="results-description">
                            View and manage student academic records.
                        </p>
                    </div>
                </div>

                <div class="results-toolbar">
                    <input
                        type="text"
                        id="results-search"
                        placeholder="Search student or course..."
                    >

                    <select id="results-grade-filter">
                        <option value="">All Grades</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                    </select>

                    <select id="results-department-filter">
                        <option value="">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Information Systems">Information Systems</option>
                    </select>
                </div>

                <div class="results-table-container">
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>Result ID</th>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Assignment</th>
                                <th>Midterm</th>
                                <th>Final</th>
                                <th>Total</th>
                                <th>Grade</th>
                                <th>Point</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="results-table-body"></tbody>
                    </table>
                </div>

                <div id="results-record-count" class="results-record-count"></div>
            </div>
        </div>
    `;

    populateResultStudents();
    displayResults(results);
    updateResultStatistics();
    updateScorePreview();

    document.getElementById("result-student").addEventListener("change", populateResultCourses);

    document.getElementById("result-form").addEventListener("submit", addResult);

    document.getElementById("assignment-score").addEventListener("input", updateScorePreview);
    document.getElementById("midterm-score").addEventListener("input", updateScorePreview);
    document.getElementById("final-score").addEventListener("input", updateScorePreview);

    document.getElementById("results-search").addEventListener("input", filterResults);
    document.getElementById("results-grade-filter").addEventListener("change", filterResults);
    document.getElementById("results-department-filter").addEventListener("change", filterResults);
}

function populateResultStudents() {
    const studentDropdown = document.getElementById("result-student");

    students.forEach(function(student) {
        studentDropdown.innerHTML += `
            <option value="${student.id}">
                ${student.id} - ${student.name}
            </option>
        `;
    });
}

function populateResultCourses() {
    const studentId = document.getElementById("result-student").value;
    const courseDropdown = document.getElementById("result-course");

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
        courseDropdown.innerHTML = `
            <option value="">Student has no registered courses</option>
        `;
    }
}

function calculateTotal(assignment, midterm, finalExam) {
    return assignment + midterm + finalExam;
}

function calculateGrade(total) {
    if (total >= 90) return "A";
    if (total >= 85) return "A-";
    if (total >= 80) return "B+";
    if (total >= 75) return "B";
    if (total >= 70) return "B-";
    if (total >= 65) return "C+";
    if (total >= 60) return "C";
    if (total >= 50) return "D";
    return "F";
}

function calculateGradePoint(grade) {
    const gradePoints = {
        "A": 4.0,
        "A-": 3.7,
        "B+": 3.3,
        "B": 3.0,
        "B-": 2.7,
        "C+": 2.3,
        "C": 2.0,
        "D": 1.0,
        "F": 0.0
    };

    return gradePoints[grade];
}

function updateScorePreview() {
    const assignmentInput = document.getElementById("assignment-score");
    const midtermInput = document.getElementById("midterm-score");
    const finalInput = document.getElementById("final-score");

    const assignment = Number(assignmentInput.value) || 0;
    const midterm = Number(midtermInput.value) || 0;
    const finalExam = Number(finalInput.value) || 0;

    const total = calculateTotal(assignment, midterm, finalExam);
    const grade = calculateGrade(total);
    const point = calculateGradePoint(grade);

    document.getElementById("preview-total").textContent = `${total.toFixed(1)} / 100`;
    document.getElementById("preview-grade").textContent = grade;
    document.getElementById("preview-point").textContent = point.toFixed(1);
}

function displayResults(resultList) {
    const tableBody = document.getElementById("results-table-body");
    const recordCount = document.getElementById("results-record-count");

    tableBody.innerHTML = "";

    if (resultList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="results-empty">
                    No results found.
                </td>
            </tr>
        `;
    } else {
        resultList.forEach(function(result) {
            const student = students.find(function(item) {
                return item.id === result.studentId;
            });

            const course = courses.find(function(item) {
                return item.code === result.courseCode;
            });

            if (!student || !course) {
                return;
            }

            tableBody.innerHTML += `
                <tr>
                    <td>${result.id}</td>
                    <td>${student.name}</td>
                    <td>${course.code}</td>
                    <td>${result.assignment.toFixed(1)}</td>
                    <td>${result.midterm.toFixed(1)}</td>
                    <td>${result.finalExam.toFixed(1)}</td>
                    <td>${result.total.toFixed(1)}</td>
                    <td>
                        <span class="grade-badge grade-${result.grade.replace("+", "plus").replace("-", "minus")}">
                            ${result.grade}
                        </span>
                    </td>
                    <td>${result.gradePoint.toFixed(1)}</td>
                    <td>
                        <button class="edit-result-btn" data-id="${result.id}">
                            Edit
                        </button>

                        <button class="delete-result-btn" data-id="${result.id}">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    recordCount.textContent = `Showing ${resultList.length} result(s)`;

    addResultActionButtons();
}

function filterResults() {
    const searchValue = document.getElementById("results-search").value.toLowerCase();
    const gradeValue = document.getElementById("results-grade-filter").value;
    const departmentValue = document.getElementById("results-department-filter").value;

    const filteredResults = results.filter(function(result) {
        const student = students.find(function(item) {
            return item.id === result.studentId;
        });

        const course = courses.find(function(item) {
            return item.code === result.courseCode;
        });

        if (!student || !course) {
            return false;
        }

        const matchesSearch =
            student.name.toLowerCase().includes(searchValue) ||
            student.id.toLowerCase().includes(searchValue) ||
            course.name.toLowerCase().includes(searchValue) ||
            course.code.toLowerCase().includes(searchValue);

        const matchesGrade = gradeValue === "" || result.grade === gradeValue;

        const matchesDepartment =
            departmentValue === "" || course.department === departmentValue;

        return matchesSearch && matchesGrade && matchesDepartment;
    });

    displayResults(filteredResults);
}

function addResultActionButtons() {
    const editButtons = document.querySelectorAll(".edit-result-btn");
    const deleteButtons = document.querySelectorAll(".delete-result-btn");

    editButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            editResult(button.dataset.id);
        });
    });

    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            deleteResult(button.dataset.id);
        });
    });
}

function addResult(event) {
    event.preventDefault();

    const studentId = document.getElementById("result-student").value;
    const courseCode = document.getElementById("result-course").value;

    const assignment = Number(document.getElementById("assignment-score").value);
    const midterm = Number(document.getElementById("midterm-score").value);
    const finalExam = Number(document.getElementById("final-score").value);

    if (!studentId || !courseCode) {
        alert("Please select a student and course.");
        return;
    }

    if (
        assignment < 0 || assignment > 20 ||
        midterm < 0 || midterm > 30 ||
        finalExam < 0 || finalExam > 50
    ) {
        alert("Scores exceed their allowed ranges.");
        return;
    }

    const existingResult = results.find(function(result) {
        return result.studentId === studentId &&
            result.courseCode === courseCode;
    });

    if (existingResult) {
        alert("Results have already been entered for this student and course.");
        return;
    }

    const total = calculateTotal(assignment, midterm, finalExam);
    const grade = calculateGrade(total);
    const gradePoint = calculateGradePoint(grade);

    results.push({
        id: generateResultId(),
        studentId: studentId,
        courseCode: courseCode,
        assignment: assignment,
        midterm: midterm,
        finalExam: finalExam,
        total: total,
        grade: grade,
        gradePoint: gradePoint
    });

    document.getElementById("result-form").reset();
    document.getElementById("result-course").innerHTML = `
        <option value="">Select Course</option>
    `;
    document.getElementById("result-course").disabled = true;

    updateScorePreview();
    filterResults();
    updateResultStatistics();

    alert("Student result saved successfully.");
}

function generateResultId() {
    let highestNumber = 0;

    results.forEach(function(result) {
        const number = Number(result.id.replace("RES", ""));

        if (number > highestNumber) {
            highestNumber = number;
        }
    });

    return "RES" + String(highestNumber + 1).padStart(3, "0");
}

function editResult(resultId) {
    const result = results.find(function(item) {
        return item.id === resultId;
    });

    if (!result) {
        alert("Result record not found.");
        return;
    }

    const formContent = `
        <form id="edit-result-form">
            <div class="form-group">
                <label>Student</label>
                <input value="${getStudentName(result.studentId)}" disabled>
            </div>

            <div class="form-group">
                <label>Course</label>
                <input value="${getCourseName(result.courseCode)}" disabled>
            </div>

            <div class="form-group">
                <label for="edit-assignment">Assignment (20)</label>
                <input
                    type="number"
                    id="edit-assignment"
                    min="0"
                    max="20"
                    step="0.1"
                    value="${result.assignment}"
                    required
                >
            </div>

            <div class="form-group">
                <label for="edit-midterm">Midterm (30)</label>
                <input
                    type="number"
                    id="edit-midterm"
                    min="0"
                    max="30"
                    step="0.1"
                    value="${result.midterm}"
                    required
                >
            </div>

            <div class="form-group">
                <label for="edit-final">Final Exam (50)</label>
                <input
                    type="number"
                    id="edit-final"
                    min="0"
                    max="50"
                    step="0.1"
                    value="${result.finalExam}"
                    required
                >
            </div>

            <div class="form-actions">
                <button type="button" class="cancel-btn" id="cancel-result-edit">
                    Cancel
                </button>

                <button type="submit" class="save-course-btn">
                    Update Result
                </button>
            </div>
        </form>
    `;

    showModal("Edit Student Result", formContent);

    document.getElementById("cancel-result-edit").addEventListener("click", closeModal);

    document.getElementById("edit-result-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const assignment = Number(document.getElementById("edit-assignment").value);
        const midterm = Number(document.getElementById("edit-midterm").value);
        const finalExam = Number(document.getElementById("edit-final").value);

        if (
            assignment < 0 || assignment > 20 ||
            midterm < 0 || midterm > 30 ||
            finalExam < 0 || finalExam > 50
        ) {
            alert("Scores exceed their allowed ranges.");
            return;
        }

        const total = calculateTotal(assignment, midterm, finalExam);
        const grade = calculateGrade(total);
        const gradePoint = calculateGradePoint(grade);

        result.assignment = assignment;
        result.midterm = midterm;
        result.finalExam = finalExam;
        result.total = total;
        result.grade = grade;
        result.gradePoint = gradePoint;

        closeModal();
        filterResults();
        updateResultStatistics();

        alert("Result updated successfully.");
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

function deleteResult(resultId) {
    const confirmed = confirm("Are you sure you want to delete this result?");

    if (!confirmed) {
        return;
    }

    const resultIndex = results.findIndex(function(result) {
        return result.id === resultId;
    });

    if (resultIndex === -1) {
        alert("Result not found.");
        return;
    }

    results.splice(resultIndex, 1);

    filterResults();
    updateResultStatistics();

    alert("Result deleted successfully.");
}

function updateResultStatistics() {
    const total = results.length;

    const average = total === 0
        ? 0
        : results.reduce(function(sum, result) {
            return sum + result.total;
        }, 0) / total;

    const passed = results.filter(function(result) {
        return result.total >= 50;
    }).length;

    const failed = results.filter(function(result) {
        return result.total < 50;
    }).length;

    document.getElementById("total-results").textContent = total;
    document.getElementById("average-score").textContent = average.toFixed(1) + "%";
    document.getElementById("passed-count").textContent = passed;
    document.getElementById("failed-count").textContent = failed;
}
