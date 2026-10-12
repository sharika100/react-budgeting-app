// Financial calculation utilities for BudgetWise

/**
 * Filter transactions for a specific month (YYYY-MM)
 */
export function filterTransactionsByMonth(transactions = [], monthStr) {
  if (!monthStr || monthStr === 'all') return transactions;
  return transactions.filter((tx) => tx.date && tx.date.startsWith(monthStr));
}

/**
 * Total income strictly from 'income' transactions
 */
export function calculateTotalIncome(transactions = []) {
  return transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
}

/**
 * Total expenses strictly from 'expense' transactions
 */
export function calculateTotalExpenses(transactions = []) {
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
}

/**
 * Remaining Balance = Total Income - Total Expenses
 */
export function calculateRemainingBalance(totalIncome, totalExpenses) {
  return (Number(totalIncome) || 0) - (Number(totalExpenses) || 0);
}

/**
 * Budget Utilization Percentage = (Total Expenses / Monthly Budget) * 100
 */
export function calculateBudgetUtilization(totalExpenses, monthlyBudget) {
  const budget = Number(monthlyBudget) || 0;
  const expenses = Number(totalExpenses) || 0;
  if (budget <= 0) return 0;
  const percentage = (expenses / budget) * 100;
  return Math.round(percentage * 10) / 10;
}

/**
 * Group expenses by category (income is excluded)
 */
export function calculateCategoryExpenses(transactions = []) {
  const map = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      const cat = tx.category || 'Other';
      const amt = Number(tx.amount) || 0;
      map[cat] = (map[cat] || 0) + amt;
    });
  return map;
}

/**
 * Calculate status for each category budget
 */
export function calculateCategoryBudgetStatus(categoryBudgets = {}, categoryExpenses = {}) {
  const categories = Array.from(
    new Set([...Object.keys(categoryBudgets), ...Object.keys(categoryExpenses)])
  );

  return categories.map((category) => {
    const budget = Number(categoryBudgets[category]) || 0;
    const spent = Number(categoryExpenses[category]) || 0;
    const remaining = budget - spent;
    const percentage = budget > 0 ? Math.round((spent / budget) * 1000) / 10 : 0;
    const isOverBudget = budget > 0 && spent > budget;
    const isNearLimit = budget > 0 && percentage >= 80 && !isOverBudget;

    return {
      category,
      budget,
      spent,
      remaining,
      percentage,
      isOverBudget,
      isNearLimit,
      hasBudget: budget > 0,
    };
  });
}

/**
 * Calculate month-by-month Income vs Expenses summary for charts
 */
export function calculateMonthlyTrends(transactions = [], numMonths = 6) {
  const monthMap = {};
  const now = new Date();

  // Initialize last numMonths in chronological order
  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d);
    monthMap[key] = {
      monthKey: key,
      month: label,
      income: 0,
      expenses: 0,
      balance: 0,
    };
  }

  // Aggregate
  transactions.forEach((tx) => {
    if (!tx.date) return;
    const key = tx.date.substring(0, 7);
    if (monthMap[key]) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        monthMap[key].income += amt;
      } else if (tx.type === 'expense') {
        monthMap[key].expenses += amt;
      }
    }
  });

  return Object.values(monthMap).map((m) => ({
    ...m,
    balance: m.income - m.expenses,
  }));
}
