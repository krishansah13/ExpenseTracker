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

showData();
dateFormatter();

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (Number(data.amount) <= 0) {
        alert("Amount should be greater than 0");
        return;
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

function showData() {
    const expensesKeeper = document.getElementById("expensesKeeper");
    const totalDisplay = document.getElementById("totalTillNow");

    expensesKeeper.innerHTML = "";

    totalDisplay.textContent = totalSum;

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    expenses.forEach(expense => addInExpenses(expense));
}

function addInExpenses(data) {
    const expensesKeeper = document.getElementById("expensesKeeper");

    const card = document.createElement("div");
    card.className = "card";

    const description = document.createElement("p");
    description.innerHTML = `
        <strong>${data.description}</strong><br>
        Amount: ₹${data.amount}<br>
        Category: ${data.category}<br>
        Date: ${data.date}
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