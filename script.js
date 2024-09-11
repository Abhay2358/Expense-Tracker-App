// Helper function to get expenses from localStorage
function getExpenses() {
    const expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
}

// Helper function to save expenses to localStorage
function saveExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to update totals and render pie chart
function updateTotals() {
    const expenses = getExpenses();
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    let expenseTypes = {
        credit: 0,
        debit: 0
    };

    expenses.forEach(expense => {
        if (expense.type === 'credit') {
            totalIncome += expense.amount;
            totalBalance += expense.amount;
            expenseTypes.credit += expense.amount;
        } else {
            totalExpenses += expense.amount;
            totalBalance -= expense.amount;
            expenseTypes.debit += expense.amount;
        }
    });

    // Update the balance, income, and expense display
    document.getElementById('balance').textContent = `₹${totalBalance.toFixed(2)}`;
    document.getElementById('money-plus').textContent = `₹${totalIncome.toFixed(2)}`;
    document.getElementById('money-minus').textContent = `₹${totalExpenses.toFixed(2)}`;

    // Render the pie chart
    renderPieChart(expenseTypes);
}

// Function to fetch and display expenses
function fetchExpenses() {
    const expenses = getExpenses();
    const expenseHistory = document.getElementById('expense-history');
    
    expenseHistory.innerHTML = ''; // Clear existing list
    
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.classList.add('p-4', 'bg-gray-100', 'border', 'border-gray-200', 'rounded-lg', 'shadow-sm', 'flex', 'justify-between', 'items-center');
        li.innerHTML = `
            <div class="flex-1">
                <span class="font-semibold">${expense.description}</span> - ₹${expense.amount}
            </div>
            <span class="${expense.type === 'credit' ? 'text-green-500' : 'text-red-500'} font-bold">${expense.type}</span>
            <span class="text-gray-400 text-sm">${new Date(expense.date).toLocaleDateString()}</span>
        `;
        expenseHistory.appendChild(li);
    });

    updateTotals(); // Update totals and render pie chart
}

// Function to render the pie chart
function renderPieChart(expenseTypes) {
    const ctx = document.getElementById('expense-pie-chart').getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Credit', 'Debit'],
            datasets: [{
                label: 'Expense Breakdown',
                data: [expenseTypes.credit, expenseTypes.debit],
                backgroundColor: ['#4caf50', '#f44336'],
                borderColor: ['#388e3c', '#d32f2f'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ₹' + tooltipItem.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Function to add a new transaction
function addTransaction(type) {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    if (description && !isNaN(amount) && date) {
        const newTransaction = {
            description,
            amount,
            type,
            date
        };

        const expenses = getExpenses();
        expenses.push(newTransaction);
        saveExpenses(expenses);

        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('date').value = '';

        fetchExpenses(); // Refresh the expense list
    } else {
        alert('Please enter a valid description, amount, and date.');
    }
}

// Function to export data as CSV
function exportData() {
    const expenses = getExpenses();
    const csvRows = [
        ['Description', 'Amount', 'Type', 'Date'],
        ...expenses.map(exp => [
            exp.description,
            exp.amount,
            exp.type,
            new Date(exp.date).toLocaleDateString()
        ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// Toggle the pie chart visibility
document.getElementById('toggle-pie-chart').addEventListener('click', function() {
    const pieChart = document.getElementById('expense-pie-chart');
    pieChart.style.display = pieChart.style.display === 'none' ? 'block' : 'none';
});

// Initialize the app
fetchExpenses();
