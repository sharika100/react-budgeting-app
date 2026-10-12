// LocalStorage and demo data management for BudgetWise

export const EXPENSE_CATEGORIES = [
  'Food',
  'Groceries',
  'Transportation',
  'Housing',
  'Utilities',
  'Healthcare',
  'Education',
  'Shopping',
  'Entertainment',
  'Travel',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Gifts',
  'Other',
];

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Groceries: '#10b981',
  Transportation: '#3b82f6',
  Housing: '#6366f1',
  Utilities: '#06b6d4',
  Healthcare: '#ec4899',
  Education: '#8b5cf6',
  Shopping: '#f43f5e',
  Entertainment: '#eab308',
  Travel: '#14b8a6',
  Other: '#64748b',
};

const STORAGE_KEYS = {
  TRANSACTIONS: 'budgetwise_transactions',
  MONTHLY_BUDGET: 'budgetwise_monthly_budget',
  CATEGORY_BUDGETS: 'budgetwise_category_budgets',
};

export const DEFAULT_MONTHLY_BUDGET = 50000;

export const DEFAULT_CATEGORY_BUDGETS = {
  Food: 6000,
  Groceries: 10000,
  Transportation: 4000,
  Housing: 18000,
  Utilities: 4000,
  Shopping: 5000,
  Entertainment: 3000,
};

export function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading transactions from localStorage:', error);
    return [];
  }
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
}

export function loadMonthlyBudget() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MONTHLY_BUDGET);
    if (raw === null || raw === undefined) return DEFAULT_MONTHLY_BUDGET;
    const num = Number(raw);
    return isNaN(num) || num < 0 ? DEFAULT_MONTHLY_BUDGET : num;
  } catch (error) {
    console.error('Error loading monthly budget:', error);
    return DEFAULT_MONTHLY_BUDGET;
  }
}

export function saveMonthlyBudget(budget) {
  try {
    localStorage.setItem(STORAGE_KEYS.MONTHLY_BUDGET, String(budget));
  } catch (error) {
    console.error('Error saving monthly budget:', error);
  }
}

export function loadCategoryBudgets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORY_BUDGETS);
    if (!raw) return DEFAULT_CATEGORY_BUDGETS;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : DEFAULT_CATEGORY_BUDGETS;
  } catch (error) {
    console.error('Error loading category budgets:', error);
    return DEFAULT_CATEGORY_BUDGETS;
  }
}

export function saveCategoryBudgets(budgets) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORY_BUDGETS, JSON.stringify(budgets));
  } catch (error) {
    console.error('Error saving category budgets:', error);
  }
}

export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.MONTHLY_BUDGET);
    localStorage.removeItem(STORAGE_KEYS.CATEGORY_BUDGETS);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

/**
 * Generate dynamic realistic demo transactions matching the current and previous month
 */
export function getDemoTransactions() {
  const now = new Date();
  const year = now.getFullYear();
  const m = now.getMonth(); // 0-based

  const formatDateStr = (y, monthIndex, d) => {
    return `${y}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const prevMonthIndex = m === 0 ? 11 : m - 1;
  const prevYear = m === 0 ? year - 1 : year;

  return [
    // Current month transactions
    {
      id: 'demo-1',
      type: 'income',
      title: 'Monthly Salary',
      amount: 75000,
      category: 'Salary',
      date: formatDateStr(year, m, 1),
      note: 'Direct deposit tech company',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      type: 'expense',
      title: 'House Rent',
      amount: 18000,
      category: 'Housing',
      date: formatDateStr(year, m, 2),
      note: 'Apartment rent paid via UPI',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      type: 'expense',
      title: 'Supermarket Groceries',
      amount: 4600,
      category: 'Groceries',
      date: formatDateStr(year, m, 4),
      note: 'Weekly essentials and fruits',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-4',
      type: 'income',
      title: 'UI Design Freelance Project',
      amount: 15000,
      category: 'Freelance',
      date: formatDateStr(year, m, 5),
      note: 'Client landing page payment',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-5',
      type: 'expense',
      title: 'Electricity & High-speed Internet',
      amount: 2800,
      category: 'Utilities',
      date: formatDateStr(year, m, 7),
      note: 'Monthly power and fiber bill',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-6',
      type: 'expense',
      title: 'Family Dinner Out',
      amount: 3200,
      category: 'Food',
      date: formatDateStr(year, m, 9),
      note: 'Weekend dining at spice bistro',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-7',
      type: 'expense',
      title: 'Monthly Metro & Fuel',
      amount: 2400,
      category: 'Transportation',
      date: formatDateStr(year, m, 10),
      note: 'Commute and car refuel',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-8',
      type: 'expense',
      title: 'Pharmacy & Wellness',
      amount: 1200,
      category: 'Healthcare',
      date: formatDateStr(year, m, 11),
      note: 'Vitamins and routine checkup',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-9',
      type: 'income',
      title: 'Dividend Payout',
      amount: 3500,
      category: 'Investments',
      date: formatDateStr(year, m, 12),
      note: 'Quarterly index fund dividend',
      createdAt: new Date().toISOString(),
    },
    // Previous month transactions for historical charts
    {
      id: 'demo-10',
      type: 'income',
      title: 'Monthly Salary',
      amount: 75000,
      category: 'Salary',
      date: formatDateStr(prevYear, prevMonthIndex, 1),
      note: 'Previous month base salary',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-11',
      type: 'expense',
      title: 'House Rent',
      amount: 18000,
      category: 'Housing',
      date: formatDateStr(prevYear, prevMonthIndex, 2),
      note: 'Paid to landlord',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-12',
      type: 'expense',
      title: 'Groceries and Provisions',
      amount: 9200,
      category: 'Groceries',
      date: formatDateStr(prevYear, prevMonthIndex, 8),
      note: 'Monthly stock up',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-13',
      type: 'expense',
      title: 'Dining & Food Delivery',
      amount: 5400,
      category: 'Food',
      date: formatDateStr(prevYear, prevMonthIndex, 14),
      note: 'Zomato & office lunches',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-14',
      type: 'expense',
      title: 'Clothing & Footwear',
      amount: 4800,
      category: 'Shopping',
      date: formatDateStr(prevYear, prevMonthIndex, 20),
      note: 'Festive shopping',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-15',
      type: 'expense',
      title: 'OTT & Movie Tickets',
      amount: 1800,
      category: 'Entertainment',
      date: formatDateStr(prevYear, prevMonthIndex, 25),
      note: 'Cinema and streaming subs',
      createdAt: new Date().toISOString(),
    },
  ];
}
