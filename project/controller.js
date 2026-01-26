const db = require("./db.js");
const transactions = db.getTransactions();
console.log(transactions);
const Totalexpense = 50000;
const Totalincome = 10000000;
const Balance = Totalincome - Totalexpense;

function rederTracsaction(transactions) {
  const transactionItems = document.getElementById("transactionItems");
  transactions.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
   <td>${item["date"]}</td>
  <td>${item["category"]}</td>
  <td>${item["amount"]}</td>
  <td>${item["type"]}</td>
  <td><button class="edit-btn"><i class="fas fa-edit"></i></button>
  <button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    `;
    transactionItems.appendChild(row);
  });
}
function rederTotal() {
  document.querySelector(".cards .card:nth-child(1) .card-value").innerText =
    "$" + Totalexpense;
  document.querySelector(".cards .card:nth-child(2) .card-value").innerText =
    "$" + Totalincome;
  document.querySelector(".cards .card:nth-child(3) .card-value").innerText =
    "$" + Balance;
}
function setForm() {
  const incomeBtn = document.getElementById("button-income");
  const expenseBtn = document.getElementById("button-expense");
  const formIncome = document.getElementById("formIncome");
  const formExpense = document.getElementById("formExpense");
  const closeFormBtns = document.querySelectorAll("#closeFormBtn");

  incomeBtn.addEventListener("click", () => {
    formIncome.style.display = "block";
  });

  expenseBtn.addEventListener("click", () => {
    formExpense.style.display = "block";
  });

  closeFormBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      formIncome.style.display = "none";
      formExpense.style.display = "none";
    });
  });
}
const saveIncome = document.querySelector(".income-btn");
saveIncome.addEventListener("click", (e) => {
  const Input = document.querySelector(".amount");
  const category = document.querySelector(".category");
  const description = document.querySelector(".description");
  const date = document.querySelector(".date");
  const submitButton = document.querySelector(".submit-btn");
  e.preventDefault();

  const incomeData = {
    Input: Input.value,
    category: category.value,
    description: description.value,
    date: date.value,
  };

  console.log(incomeData);
});

const saveExpense = document.querySelector(".expense-btn");
saveExpense.addEventListener("click", (e) => {
  const Input = document.querySelector(".amount");
  const category = document.querySelector(".category");
  const description = document.querySelector(".description");
  const date = document.querySelector(".date");
  const submitButton = document.querySelector(".submit-btn");
  e.preventDefault();

  const expenseData = {
    Input: Input.value,
    category: category.value,
    description: description.value,
    date: date.value,
  };

  console.log(expenseData);
});

setForm();
rederTotal();
rederTracsaction(transactions);

const allData = {
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [30, 60, 40, 90, 70, 50, 20],
    highlightIndex: new Date().getDay() - 1,
  },
  month: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    data: [120, 90, 150, 80, 200, 170, 140, 160, 130, 180, 190, 220],
    highlightIndex: new Date().getMonth(),
  },
  year: {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    data: [1500, 1800, 2100, 2500, 2800],
    highlightIndex: 4,
  },
};

const ctx = document.getElementById("barChart");

const data = [50, 75, 40, 90, 120, 60, 30];
const highlightIndex = 1; // Tue (Today)

let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: allData.year.labels,
    datasets: [
      {
        label: "Expenses",
        data: data,
        backgroundColor: data.map((v, i) =>
          i === highlightIndex ? "#ff6b6b" : "#dcdcdc",
        ),
      },
    ],
  },
  options: {
    scales: {
      y: { beginAtZero: true },
    },
  },
});

function updateChart(type) {
  const selectedData = allData[type];
  chart.data.labels = selectedData.labels;
  chart.data.datasets[0].data = selectedData.data;
  chart.data.datasets[0].backgroundColor = selectedData.data.map((v, i) =>
    i === selectedData.highlightIndex ? "#ff6b6b" : "#dcdcdc",
  );
  chart.update();
}
const select = document.getElementById("timeSelect");

select.addEventListener("change", (e) => {
  updateChart(e.target.value);
});

document.getElementById("button-income").addEventListener("click", function () {
  const form = document.getElementById("formIncome");

  form.classList.add("active");
});

document.getElementById("closeFormBtn").addEventListener("click", function () {
  const form = document.getElementById("formIncome");
  form.classList.remove("active");
});
