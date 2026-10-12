import { describe, it, expect } from 'vitest';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateRemainingBalance,
  calculateBudgetUtilization,
  calculateCategoryExpenses,
  calculateCategoryBudgetStatus,
  filterTransactionsByMonth,
} from '../calculations';

describe('Financial Calculations', () => {
  const sampleTransactions = [
    { id: '1', type: 'income', amount: 50000, category: 'Salary', date: '2026-10-01' },
    { id: '2', type: 'income', amount: 10000, category: 'Freelance', date: '2026-10-05' },
    { id: '3', type: 'expense', amount: 15000, category: 'Housing', date: '2026-10-02' },
    { id: '4', type: 'expense', amount: 5000, category: 'Food', date: '2026-10-04' },
    { id: '5', type: 'expense', amount: 2000, category: 'Utilities', date: '2026-09-25' },
  ];

  it('calculates total income strictly from income transactions', () => {
    const totalIncome = calculateTotalIncome(sampleTransactions);
    expect(totalIncome).toBe(60000);
  });

  it('calculates total expenses strictly from expense transactions', () => {
    const totalExpenses = calculateTotalExpenses(sampleTransactions);
    expect(totalExpenses).toBe(22000);
  });

  it('calculates remaining balance as Total Income - Total Expenses', () => {
    const income = calculateTotalIncome(sampleTransactions);
    const expenses = calculateTotalExpenses(sampleTransactions);
    const balance = calculateRemainingBalance(income, expenses);
    expect(balance).toBe(38000);
  });

  it('calculates budget utilization percentage correctly', () => {
    expect(calculateBudgetUtilization(20000, 40000)).toBe(50);
    expect(calculateBudgetUtilization(36000, 40000)).toBe(90);
    expect(calculateBudgetUtilization(45000, 40000)).toBe(112.5);
    expect(calculateBudgetUtilization(1000, 0)).toBe(0);
  });

  it('groups expenses by category without including income', () => {
    const categoryExpenses = calculateCategoryExpenses(sampleTransactions);
    expect(categoryExpenses).toEqual({
      Housing: 15000,
      Food: 5000,
      Utilities: 2000,
    });
    expect(categoryExpenses['Salary']).toBeUndefined();
  });

  it('evaluates category budget thresholds and warnings', () => {
    const budgets = {
      Housing: 18000,
      Food: 6000,
      Utilities: 1500,
    };
    const expenses = {
      Housing: 9000,  // 50% - normal
      Food: 5000,     // 83.3% - near limit
      Utilities: 2000 // 133.3% - over budget
    };

    const statusList = calculateCategoryBudgetStatus(budgets, expenses);
    const housingStatus = statusList.find((s) => s.category === 'Housing');
    const foodStatus = statusList.find((s) => s.category === 'Food');
    const utilitiesStatus = statusList.find((s) => s.category === 'Utilities');

    expect(housingStatus.isNearLimit).toBe(false);
    expect(housingStatus.isOverBudget).toBe(false);
    expect(housingStatus.remaining).toBe(9000);

    expect(foodStatus.isNearLimit).toBe(true);
    expect(foodStatus.isOverBudget).toBe(false);

    expect(utilitiesStatus.isOverBudget).toBe(true);
    expect(utilitiesStatus.remaining).toBe(-500);
  });

  it('filters transactions by month correctly', () => {
    const octTransactions = filterTransactionsByMonth(sampleTransactions, '2026-10');
    expect(octTransactions.length).toBe(4);

    const sepTransactions = filterTransactionsByMonth(sampleTransactions, '2026-09');
    expect(sepTransactions.length).toBe(1);
    expect(sepTransactions[0].id).toBe('5');
  });
});
