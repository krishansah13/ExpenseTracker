let id = 0;
let totalSum = 0;
let editingId = null;

// Initialize localStorage
if (!localStorage.getItem("expenses")) {
    localStorage.setItem("expenses", JSON.stringify([]));
} else {
    const expenses = JSON.parse(localStorage.getItem("expenses"));
    if (expenses.length > 0) {
        id = expenses[expenses.length - 1].id;
    }
}

if (!localStorage.getItem("totalSum")) {
    localStorage.setItem("totalSum", "0");
}

totalSum = Number(localStorage.getItem("totalSum"));

const form = document.querySelector("form");
const searchCategory = document.getElementById('category-search');
const searchButton = document.getElementById("search-button");

showData();
dateFormatter();

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const numberChecker = document.getElementById('numberChecker');

    if (Number(data.amount) <= 0) {
        numberChecker.innerHTML='The number should be greater than 0';
        return;
    } else {
        numberChecker.innerHTML = '';
        // numberChecker.style.display = "none";
    }


    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (editingId !== null) {
        // UPDATE
        const index = expenses.findIndex(exp => exp.id == editingId);

        totalSum -= Number(expenses[index].amount);

        data.id = editingId;
        expenses[index] = data;

        totalSum += Number(data.amount);

        editingId = null;
    } else {
        // ADD
        data.id = ++id;
        expenses.push(data);

        totalSum += Number(data.amount);
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("totalSum", totalSum);

    form.reset();
    showData();
});

searchButton.addEventListener("click", () => {
    const val = searchCategory.value;
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (val === "") {
        updateDisplay(expenses); 
        return;
    }

    const filtered = expenses.filter(exp => exp.category === val);

    updateDisplay(filtered);
});

function showData() {
    const totalDisplay = document.getElementById("totalTillNow");
    totalDisplay.textContent = `₹ ${totalSum}`;

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    updateDisplay(expenses);
}

function updateDisplay(expensesArray) {
    const expensesKeeper = document.getElementById("expensesKeeper");

    expensesKeeper.innerHTML = "";

    expensesArray.forEach(expense => {
        addInExpenses(expense);
    });
}

function addInExpenses(data) {
    const expensesKeeper = document.getElementById("expensesKeeper");
    
    const card = document.createElement("div");
    card.className = "card";

    const description = document.createElement("p");
    description.innerHTML = `
        <h2>${data.description}</h2><br>
        <b>Amount:</b> <i>₹${data.amount}</i><br>
        <b>Category:</b> <i>${data.category}</i><br>
        <b>Date:</b> <i>${data.date}</i>
    `;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    editBtn.addEventListener("click", () => {
        editData(data.id);
    });

    deleteBtn.addEventListener("click", () => {
        deleteData(data.id);
    });

    card.appendChild(description);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);

    expensesKeeper.appendChild(card);

    editBtn.removeEventListener('click',() => {
        editData(data.id);
    });
    deleteBtn.removeEventListener('click',() => {
        deleteData(data.id);
    });
}

function editData(id) {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const expense = expenses.find(exp => exp.id == id);
    if (!expense) return;

    document.querySelector('[name="description"]').value = expense.description;
    document.querySelector('[name="amount"]').value = expense.amount;
    document.querySelector('[name="category"]').value = expense.category;
    document.querySelector('[name="date"]').value = expense.date;

    editingId = id;
}

function deleteData(id) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const expense = expenses.find(exp => exp.id == id);

    if (!expense) return;

    totalSum -= Number(expense.amount);

    expenses = expenses.filter(exp => exp.id != id);

    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("totalSum", totalSum);

    if (editingId === id) {
        editingId = null;
        form.reset();
    }
    showData();
}

function dateFormatter() {
    let today = new Date();
    const year = today.getFullYear();
    const mon = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');

    const formattedToday = `${year}-${mon}-${date}`;
    document.getElementById('date').max = formattedToday;
}