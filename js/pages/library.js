
import { students, books, borrowings } from "../data/initialData.js";

export function renderLibrary() {
    const pageContent = document.getElementById("page-content");

    pageContent.innerHTML = `
        <div class="library-page">

            <div class="library-statistics">
                <div class="library-stat-card">
                    <div class="library-stat-icon books-icon">📚</div>
                    <div>
                        <p>Book Titles</p>
                        <h3 id="library-title-count">0</h3>
                    </div>
                </div>

                <div class="library-stat-card">
                    <div class="library-stat-icon copies-icon">📖</div>
                    <div>
                        <p>Total Copies</p>
                        <h3 id="library-total-copies">0</h3>
                    </div>
                </div>

                <div class="library-stat-card">
                    <div class="library-stat-icon available-icon">🟢</div>
                    <div>
                        <p>Available Copies</p>
                        <h3 id="library-available-copies">0</h3>
                    </div>
                </div>

                <div class="library-stat-card">
                    <div class="library-stat-icon borrowed-icon">📕</div>
                    <div>
                        <p>Borrowed Books</p>
                        <h3 id="library-borrowed-count">0</h3>
                    </div>
                </div>
            </div>

            <div class="library-section">
                <div class="library-section-header">
                    <h2>Book Inventory</h2>
                    <button id="show-book-form" class="library-primary-btn">
                        + Add Book
                    </button>
                </div>

                <div id="book-form-container"></div>

                <div class="library-toolbar">
                    <input
                        type="text"
                        id="book-search"
                        placeholder="Search by title, author, or ID..."
                    >

                    <select id="book-category-filter">
                        <option value="all">All Categories</option>
                    </select>
                </div>

                <div class="library-table-container">
                    <table class="library-table">
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Total Copies</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="books-table-body"></tbody>
                    </table>
                </div>

                <div id="books-record-count" class="library-record-count"></div>
            </div>

            <div class="library-section">
                <h2>Borrow a Book</h2>

                <form id="borrow-form" class="borrow-form">
                    <div class="borrow-form-grid">
                        <div class="form-group">
                            <label for="borrow-student">Student</label>
                            <select id="borrow-student" required>
                                <option value="">Select student</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="borrow-book">Book</label>
                            <select id="borrow-book" required>
                                <option value="">Select available book</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="borrow-date">Borrow Date</label>
                            <input type="date" id="borrow-date" required>
                        </div>

                        <div class="form-group">
                            <label for="due-date">Due Date</label>
                            <input type="date" id="due-date" required>
                        </div>
                    </div>

                    <button type="submit" class="library-primary-btn">
                Borrow Book
                    </button>
                </form>
            </div>

            <div class="library-section">
                <div class="library-section-header">
                    <h2>Borrowing Records</h2>
                </div>

                <div class="library-toolbar">
                    <input
                        type="text"
                        id="borrowing-search"
                        placeholder="Search student or book..."
                    >

                    <select id="borrowing-status-filter">
                        <option value="all">All Records</option>
                        <option value="Borrowed">Borrowed</option>
                        <option value="Returned">Returned</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>

                <div class="library-table-container">
                    <table class="library-table">
                        <thead>
                            <tr>
                                <th>Record ID</th>
                                <th>Student</th>
                                <th>Book</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody id="borrowings-table-body"></tbody>
                    </table>
                </div>

                <div id="borrowings-record-count" class="library-record-count"></div>
            </div>
        </div>
    `;

    createBookForm();
    populateBookCategories();
    populateBorrowStudents();
    populateBorrowBooks();
    setBorrowDates();
    displayBooks();
    displayBorrowings();
    updateLibraryStatistics();

    document.getElementById("show-book-form").addEventListener("click", showBookForm);
    document.getElementById("book-search").addEventListener("input", displayBooks);
    document.getElementById("book-category-filter").addEventListener("change", displayBooks);
    document.getElementById("borrow-form").addEventListener("submit", borrowBook);
    document.getElementById("borrowing-search").addEventListener("input", displayBorrowings);
    document.getElementById("borrowing-status-filter").addEventListener("change", displayBorrowings);
}

function createBookForm() {
    const container = document.getElementById("book-form-container");

    container.innerHTML = `
        <form id="book-form" class="book-form hidden">
            <h3 id="book-form-title">Add New Book</h3>

            <div class="book-form-grid">
                <div class="form-group">
                    <label for="book-title">Title</label>
                    <input type="text" id="book-title" required>
                </div>

                <div class="form-group">
                    <label for="book-author">Author</label>
                    <input type="text" id="book-author" required>
                </div>

                <div class="form-group">
                    <label for="book-category">Category</label>
                    <input type="text" id="book-category" required>
                </div>

                <div class="form-group">
                    <label for="book-copies">Number of Copies</label>
                    <input type="number" id="book-copies" min="1" required>
                </div>
            </div>

            <div class="book-form-actions">
                <button type="submit" class="library-primary-btn" id="save-book-btn">
                    Save Book
                </button>

                <button type="button" id="cancel-book-form" class="library-secondary-btn">
                    Cancel
                </button>
            </div>
        </form>
    `;

    document.getElementById("book-form").addEventListener("submit", saveBook);
    document.getElementById("cancel-book-form").addEventListener("click", hideBookForm);
}

function showBookForm() {
    const form = document.getElementById("book-form");

    form.classList.remove("hidden");
    form.reset();

    document.getElementById("book-form-title").textContent = "Add New Book";
    document.getElementById("save-book-btn").textContent = "Save Book";
    form.dataset.editId = "";
}

function hideBookForm() {
    document.getElementById("book-form").classList.add("hidden");
    document.getElementById("book-form").reset();
    document.getElementById("book-form").dataset.editId = "";
}

function generateBookId() {
    const highestId = books.reduce((highest, book) => {
        const number = Number(book.id.replace("BK", ""));
        return Math.max(highest, number);
    }, 0);

    return `BK${String(highestId + 1).padStart(3, "0")}`;
}

function saveBook(event) {
    event.preventDefault();

    const form = document.getElementById("book-form");
    const editId = form.dataset.editId;

    const title = document.getElementById("book-title").value.trim();
    const author = document.getElementById("book-author").value.trim();
    const category = document.getElementById("book-category").value.trim();
    const copies = Number(document.getElementById("book-copies").value);

    if (!title || !author || !category || !Number.isInteger(copies) || copies < 1) {
        alert("Please enter valid book information.");
        return;
    }

    if (editId) {
        const book = books.find(book => book.id === editId);

        if (!book) return;

        const borrowedCopies = book.copies - book.available;

        if (copies < borrowedCopies) {
            alert(`You cannot reduce copies below ${borrowedCopies}, because they are currently borrowed.`);
            return;
        }

        book.title = title;
        book.author = author;
        book.category = category;
        book.copies = copies;
        book.available = copies - borrowedCopies;
    } else {
        books.push({
            id: generateBookId(),
            title,
            author,
            category,
            copies,
            available: copies
        });
    }

    hideBookForm();
    populateBookCategories();
    populateBorrowBooks();
    displayBooks();
    displayBorrowings();
    updateLibraryStatistics();
}

function editBook(id) {
    const book = books.find(book => book.id === id);

    if (!book) return;

    const form = document.getElementById("book-form");

    form.classList.remove("hidden");
    form.dataset.editId = id;

    document.getElementById("book-form-title").textContent = "Edit Book";
    document.getElementById("save-book-btn").textContent = "Update Book";
    document.getElementById("book-title").value = book.title;
    document.getElementById("book-author").value = book.author;
    document.getElementById("book-category").value = book.category;
    document.getElementById("book-copies").value = book.copies;

    form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteBook(id) {
    const book = books.find(book => book.id === id);

    if (!book) return;

    const hasBorrowedRecords = borrowings.some(
        borrowing => borrowing.bookId === id && borrowing.status === "Borrowed"
    );

    if (hasBorrowedRecords) {
        alert("This book cannot be deleted while copies are borrowed.");
        return;
    }

    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) {
        return;
    }

    const bookIndex = books.findIndex(book => book.id === id);

    books.splice(bookIndex, 1);

    populateBookCategories();
    populateBorrowBooks();
    displayBooks();
    displayBorrowings();
    updateLibraryStatistics();
}

function populateBookCategories() {
    const select = document.getElementById("book-category-filter");
    const selectedCategory = select.value;

    const categories = [...new Set(books.map(book => book.category))];

    select.innerHTML = `<option value="all">All Categories</option>`;

    categories.forEach(category => {
        select.innerHTML += `
            <option value="${category}">${category}</option>
        `;
    });

    if (categories.includes(selectedCategory)) {
        select.value = selectedCategory;
    }
}

function displayBooks() {
    const tbody = document.getElementById("books-table-body");
    const search = document.getElementById("book-search").value.toLowerCase();
    const categoryFilter = document.getElementById("book-category-filter").value;

    tbody.innerHTML = "";

    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search) ||
            book.id.toLowerCase().includes(search);

        const matchesCategory =
            categoryFilter === "all" || book.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    filteredBooks.forEach(book => {
        tbody.innerHTML += `
            <tr>
                <td>${book.id}</td>
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${book.copies}</td>
                <td>
                    <span class="availability-badge ${book.available === 0 ? "not-available" : ""}">
                        ${book.available}
                    </span>
                </td>
                <td class="library-actions">
                    <button class="edit-book-btn" onclick="editBook('${book.id}')">
                        Edit
                    </button>
                    <button class="delete-book-btn" onclick="deleteBook('${book.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    if (filteredBooks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="library-empty">
                    No books found.
                </td>
            </tr>
        `;
    }

    document.getElementById("books-record-count").textContent =
        `Showing ${filteredBooks.length} of ${books.length} books`;
}

function populateBorrowStudents() {
    const select = document.getElementById("borrow-student");

    select.innerHTML = `<option value="">Select student</option>`;

    students.forEach(student => {
        select.innerHTML += `
            <option value="${student.id}">
                ${student.id} - ${student.name}
            </option>
        `;
    });
}

function populateBorrowBooks() {
    const select = document.getElementById("borrow-book");
    const selectedBook = select.value;

    select.innerHTML = `<option value="">Select available book</option>`;

    books.filter(book => book.available > 0).forEach(book => {
        select.innerHTML += `
            <option value="${book.id}">
                ${book.title} (${book.available} available)
            </option>
        `;
    });

    if (books.some(book => book.id === selectedBook && book.available > 0)) {
        select.value = selectedBook;
    }
}

function setBorrowDates() {
    const borrowDate = document.getElementById("borrow-date");
    const dueDate = document.getElementById("due-date");

    const today = new Date();
    const due = new Date(today);

    due.setDate(due.getDate() + 14);

    borrowDate.value = formatDate(today);
    dueDate.value = formatDate(due);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function generateBorrowingId() {
    const highestId = borrowings.reduce((highest, borrowing) => {
        const number = Number(borrowing.id.replace("BOR", ""));
        return Math.max(highest, number);
    }, 0);

    return `BOR${String(highestId + 1).padStart(3, "0")}`;
}

function borrowBook(event) {
    event.preventDefault();

    const studentId = document.getElementById("borrow-student").value;
    const bookId = document.getElementById("borrow-book").value;
    const borrowDate = document.getElementById("borrow-date").value;
    const dueDate = document.getElementById("due-date").value;

    const student = students.find(student => student.id === studentId);
    const book = books.find(book => book.id === bookId);

    if (!student || !book) {
        alert("Please select a valid student and book.");
        return;
    }

    if (book.available <= 0) {
        alert("This book is currently unavailable.");
        return;
    }

    if (!borrowDate || !dueDate || dueDate < borrowDate) {
        alert("The due date must be on or after the borrow date.");
        return;
    }

    borrowings.push({
        id: generateBorrowingId(),
        studentId,
        bookId,
        borrowDate,
        dueDate,
        returnDate: "",
        status: "Borrowed"
    });

    book.available--;

    document.getElementById("borrow-form").reset();

    setBorrowDates();
    populateBorrowBooks();
    displayBooks();
    displayBorrowings();
    updateLibraryStatistics();
}

function getBorrowingStatus(borrowing) {
    if (borrowing.status === "Returned") {
        return "Returned";
    }

    const today = formatDate(new Date());

    if (borrowing.dueDate < today) {
        return "Overdue";
    }

    return "Borrowed";
}

function displayBorrowings() {
    const tbody = document.getElementById("borrowings-table-body");
    const search = document.getElementById("borrowing-search").value.toLowerCase();
    const statusFilter = document.getElementById("borrowing-status-filter").value;

    tbody.innerHTML = "";

    const filteredBorrowings = borrowings.filter(borrowing => {
        const student = students.find(student => student.id === borrowing.studentId);
        const book = books.find(book => book.id === borrowing.bookId);

        if (!student || !book) {
            return false;
        }

        const status = getBorrowingStatus(borrowing);

        const matchesSearch =
            student.name.toLowerCase().includes(search) ||
            student.id.toLowerCase().includes(search) ||
            book.title.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "all" || status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    filteredBorrowings.forEach(borrowing => {
        const student = students.find(student => student.id === borrowing.studentId);
        const book = books.find(book => book.id === borrowing.bookId);
        const status = getBorrowingStatus(borrowing);

        tbody.innerHTML += `
            <tr>
                <td>${borrowing.id}</td>
                <td>
                    <strong>${student.name}</strong>
                    <small>${student.id}</small>
                </td>
                <td>${book.title}</td>
                <td>${borrowing.borrowDate}</td>
                <td>${borrowing.dueDate}</td>
                <td>${borrowing.returnDate || "—"}</td>
                <td>
                    <span class="borrowing-status borrowing-${status.toLowerCase()}">
                        ${status}
                    </span>
                </td>
                <td>
                    ${
                        borrowing.status === "Borrowed"
                            ? `<button class="return-book-btn" onclick="returnBook('${borrowing.id}')">Return</button>`
                            : `<span class="returned-label">Completed</span>`
                    }
                </td>
            </tr>
        `;
    });

    if (filteredBorrowings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="library-empty">
                    No borrowing records found.
                </td>
            </tr>
        `;
    }

    document.getElementById("borrowings-record-count").textContent =
        `Showing ${filteredBorrowings.length} of ${borrowings.length} borrowing records`;
}

function returnBook(id) {
    const borrowing = borrowings.find(borrowing => borrowing.id === id);

    if (!borrowing || borrowing.status !== "Borrowed") {
        return;
    }

    if (!confirm("Confirm that this book has been returned?")) {
        return;
    }

    const book = books.find(book => book.id === borrowing.bookId);

    if (!book) {
        alert("The book record could not be found.");
        return;
    }

    borrowing.status = "Returned";
    borrowing.returnDate = formatDate(new Date());

    book.available = Math.min(book.available + 1, book.copies);

    populateBorrowBooks();
    displayBooks();
    displayBorrowings();
    updateLibraryStatistics();
}

function updateLibraryStatistics() {
    const totalTitles = books.length;

    const totalCopies = books.reduce((sum, book) => sum + book.copies, 0);

    const availableCopies = books.reduce((sum, book) => sum + book.available, 0);

    const borrowedCopies = borrowings.filter(
        borrowing => borrowing.status === "Borrowed"
    ).length;

    document.getElementById("library-title-count").textContent = totalTitles;
    document.getElementById("library-total-copies").textContent = totalCopies;
    document.getElementById("library-available-copies").textContent = availableCopies;
    document.getElementById("library-borrowed-count").textContent = borrowedCopies;
}

window.editBook = editBook;
window.deleteBook = deleteBook;
window.returnBook = returnBook;
