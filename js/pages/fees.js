
import { students, fees } from "../data/initialData.js";
import { showModal, closeModal } from "../components/modal.js";

export function renderFees() {
    const pageContent = document.getElementById("page-content");

    pageContent.innerHTML = `
        <div class="fees-page">
            <div class="fees-statistics">
                <div class="fee-stat-card">
                    <div class="fee-stat-icon total-fees-icon">💰</div>
                    <div>
                        <p>Total Expected</p>
                        <h3 id="total-expected">0 ETB</h3>
                    </div>
                </div>

                <div class="fee-stat-card">
                    <div class="fee-stat-icon collected-fees-icon">💵</div>
                    <div>
                        <p>Total Collected</p>
                        <h3 id="total-collected">0 ETB</h3>
                    </div>
                </div>

                <div class="fee-stat-card">
                    <div class="fee-stat-icon outstanding-fees-icon">📉</div>
                    <div>
                        <p>Outstanding</p>
                        <h3 id="total-outstanding">0 ETB</h3>
                    </div>
                </div>

                <div class="fee-stat-card">
                    <div class="fee-stat-icon paid-fees-icon">✅</div>
                    <div>
                        <p>Fully Paid</p>
                        <h3 id="fully-paid-count">0</h3>
                    </div>
                </div>
            </div>

            <div class="fees-form-card">
                <h2>Add Student Fee Record</h2>

                <form id="fees-form">
                    <div class="fees-form-grid">
                        <div class="form-group">
                            <label for="fee-student">Student</label>
                            <select id="fee-student" required>
                                <option value="">Select student</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="fee-amount">Total Fee (ETB)</label>
                            <input
                                type="number"
                                id="fee-amount"
                                min="0"
                                step="0.01"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label for="fee-paid">Amount Paid (ETB)</label>
                            <input
                                type="number"
                                id="fee-paid"
                                min="0"
                                step="0.01"
                                value="0"
                                required
                            >
                        </div>
                    </div>

                    <button type="submit" class="add-fee-btn">
                        Add Fee Record
                    </button>
                </form>
            </div>

            <div class="fees-toolbar">
                <input
                    type="text"
                    id="fee-search"
                    placeholder="Search student by name or ID..."
                >

                <select id="fee-status-filter">
                    <option value="all">All Payment Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid</option>
                </select>

                <select id="fee-department-filter">
                    <option value="all">All Departments</option>
                </select>
            </div>

            <div class="fees-table-container">
                <table class="fees-table">
                    <thead>
                        <tr>
                            <th>Fee ID</th>
                            <th>Student</th>
                            <th>Department</th>
                            <th>Total Fee</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody id="fees-table-body"></tbody>
                </table>
            </div>

            <div id="fees-record-count" class="fees-record-count"></div>
        </div>
    `;

    populateFeeStudents();
    populateFeeDepartments();
    displayFees();
    updateFeeStatistics();

    document.getElementById("fees-form").addEventListener("submit", addFeeRecord);
    document.getElementById("fee-search").addEventListener("input", displayFees);
    document.getElementById("fee-status-filter").addEventListener("change", displayFees);
    document.getElementById("fee-department-filter").addEventListener("change", displayFees);
}

function populateFeeStudents() {
    const select = document.getElementById("fee-student");

    students.forEach(student => {
        select.innerHTML += `
            <option value="${student.id}">
                ${student.id} - ${student.name}
            </option>
        `;
    });
}

function populateFeeDepartments() {
    const select = document.getElementById("fee-department-filter");

    const departments = [...new Set(students.map(student => student.department))];

    departments.forEach(department => {
        select.innerHTML += `
            <option value="${department}">${department}</option>
        `;
    });
}

function calculateFeeStatus(feeAmount, paidAmount) {
    if (paidAmount >= feeAmount) {
        return "Paid";
    }

    if (paidAmount > 0) {
        return "Partial";
    }

    return "Unpaid";
}

function calculateBalance(feeAmount, paidAmount) {
    return Math.max(feeAmount - paidAmount, 0);
}

function generateFeeId() {
    const highestId = fees.reduce((highest, fee) => {
        const number = Number(fee.id.replace("FE", ""));
        return Math.max(highest, number);
    }, 0);

    return `FE${String(highestId + 1).padStart(3, "0")}`;
}

function addFeeRecord(event) {
    event.preventDefault();

    const studentId = document.getElementById("fee-student").value;
    const feeAmount = Number(document.getElementById("fee-amount").value);
    const paidAmount = Number(document.getElementById("fee-paid").value);

    if (!studentId || feeAmount <= 0 || paidAmount < 0 || paidAmount > feeAmount) {
        alert("Please enter valid fee amounts.");
        return;
    }

    const existingFee = fees.find(fee => fee.studentId === studentId);

    if (existingFee) {
        alert("This student already has a fee record. Please update the existing record.");
        return;
    }

    const balance = calculateBalance(feeAmount, paidAmount);
    const status = calculateFeeStatus(feeAmount, paidAmount);

    fees.push({
        id: generateFeeId(),
        studentId,
        feeAmount,
        paidAmount,
        balance,
        status
    });

    document.getElementById("fees-form").reset();

    displayFees();
    updateFeeStatistics();
}

function displayFees() {
    const tbody = document.getElementById("fees-table-body");
    const search = document.getElementById("fee-search").value.toLowerCase();
    const statusFilter = document.getElementById("fee-status-filter").value;
    const departmentFilter = document.getElementById("fee-department-filter").value;

    tbody.innerHTML = "";

    const filteredFees = fees.filter(fee => {
        const student = students.find(student => student.id === fee.studentId);

        if (!student) {
            return false;
        }

        const matchesSearch =
            student.name.toLowerCase().includes(search) ||
            student.id.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "all" || fee.status === statusFilter;

        const matchesDepartment =
            departmentFilter === "all" || student.department === departmentFilter;

        return matchesSearch && matchesStatus && matchesDepartment;
    });

    filteredFees.forEach(fee => {
        const student = students.find(student => student.id === fee.studentId);

        tbody.innerHTML += `
            <tr>
                <td>${fee.id}</td>
                <td>
                    <strong>${student.name}</strong>
                    <small>${student.id}</small>
                </td>
                <td>${student.department}</td>
                <td>${fee.feeAmount.toLocaleString()} ETB</td>
                <td>${fee.paidAmount.toLocaleString()} ETB</td>
                <td>${fee.balance.toLocaleString()} ETB</td>
                <td>
                    <span class="fee-status fee-${fee.status.toLowerCase()}">
                        ${fee.status}
                    </span>
                </td>
                <td class="fee-actions">
                    <button class="edit-fee-btn" onclick="editFee('${fee.id}')">
                        Edit
                    </button>
                    <button class="payment-fee-btn" onclick="updatePayment('${fee.id}')">
                        Payment
                    </button>
                    <button class="delete-fee-btn" onclick="deleteFee('${fee.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    if (filteredFees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="fees-empty">
                    No fee records found.
                </td>
            </tr>
        `;
    }

    document.getElementById("fees-record-count").textContent =
        `Showing ${filteredFees.length} of ${fees.length} fee records`;
}

function updateFeeStatistics() {
    const totalExpected = fees.reduce((sum, fee) => sum + fee.feeAmount, 0);
    const totalCollected = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const totalOutstanding = fees.reduce((sum, fee) => sum + fee.balance, 0);
    const fullyPaid = fees.filter(fee => fee.status === "Paid").length;

    document.getElementById("total-expected").textContent =
        `${totalExpected.toLocaleString()} ETB`;

    document.getElementById("total-collected").textContent =
        `${totalCollected.toLocaleString()} ETB`;

    document.getElementById("total-outstanding").textContent =
        `${totalOutstanding.toLocaleString()} ETB`;

    document.getElementById("fully-paid-count").textContent = fullyPaid;
}

window.editFee = function(id) {
    const fee = fees.find(fee => fee.id === id);

    if (!fee) return;

    showModal("Edit Fee Record", `
        <form id="edit-fee-form">
            <div class="form-group">
                <label>Total Fee (ETB)</label>
                <input
                    type="number"
                    id="edit-fee-amount"
                    min="0"
                    step="0.01"
                    value="${fee.feeAmount}"
                    required
                >
            </div>

            <div class="form-group">
                <label>Amount Paid (ETB)</label>
                <input
                    type="number"
                    id="edit-fee-paid"
                    min="0"
                    step="0.01"
                    value="${fee.paidAmount}"
                    required
                >
            </div>

            <button type="submit" class="add-fee-btn">Save Changes</button>
        </form>
    `);

    document.getElementById("edit-fee-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const feeAmount = Number(document.getElementById("edit-fee-amount").value);
        const paidAmount = Number(document.getElementById("edit-fee-paid").value);

        if (feeAmount <= 0 || paidAmount < 0 || paidAmount > feeAmount) {
            alert("Please enter valid fee amounts.");
            return;
        }

        fee.feeAmount = feeAmount;
        fee.paidAmount = paidAmount;
        fee.balance = calculateBalance(feeAmount, paidAmount);
        fee.status = calculateFeeStatus(feeAmount, paidAmount);

        closeModal();
        displayFees();
        updateFeeStatistics();
    });
};

window.updatePayment = function(id) {
    const fee = fees.find(fee => fee.id === id);

    if (!fee) return;

    showModal("Record Payment", `
        <form id="payment-form">
            <div class="form-group">
                <label>Current Balance</label>
                <input type="text" value="${fee.balance.toLocaleString()} ETB" disabled>
            </div>

            <div class="form-group">
                <label>New Payment (ETB)</label>
                <input
                    type="number"
                    id="new-payment"
                    min="0.01"
                    step="0.01"
                    required
                >
            </div>

            <button type="submit" class="payment-fee-btn">Record Payment</button>
        </form>
    `);

    document.getElementById("payment-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const payment = Number(document.getElementById("new-payment").value);

        if (!Number.isFinite(payment) || payment <= 0 || payment > fee.balance) {
            alert("Payment must be greater than zero and cannot exceed the remaining balance.");
            return;
        }

        fee.paidAmount += payment;
        fee.balance = calculateBalance(fee.feeAmount, fee.paidAmount);
        fee.status = calculateFeeStatus(fee.feeAmount, fee.paidAmount);

        closeModal();
        displayFees();
        updateFeeStatistics();
    });
};

window.deleteFee = function(id) {
    const feeIndex = fees.findIndex(fee => fee.id === id);

    if (feeIndex === -1) return;

    if (!confirm("Are you sure you want to delete this fee record?")) {
        return;
    }

    fees.splice(feeIndex, 1);

    displayFees();
    updateFeeStatistics();
};
