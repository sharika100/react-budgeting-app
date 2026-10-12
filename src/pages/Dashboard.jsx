import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Percent,
  AlertTriangle,
  AlertCircle,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Edit2,
  Trash2,
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import ExpenseChart from '../components/ExpenseChart';
import BudgetProgress from '../components/BudgetProgress';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateRemainingBalance,
  calculateBudgetUtilization,
  calculateCategoryExpenses,
  calculateMonthlyTrends,
  filterTransactionsByMonth,
} from '../utils/calculations';
import { formatCurrency, formatDate, formatMonthName } from '../utils/formatters';

export default function Dashboard({
  transactions = [],
  monthlyBudget,
  categoryBudgets = {},
  selectedMonth,
  onOpenAddTransaction,
  onOpenEditTransaction,
  onOpenDeleteTransaction,
  onOpenEditMonthlyBudget,
  onOpenAddCategoryBudget,
  onOpenEditCategoryBudget,
  onDeleteCategoryBudget,
  onOpenDemoPrompt,
  setActiveTab,
}) {
  // Filter transactions based on selectedMonth
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByMonth(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  // Dynamic calculations
  const totalIncome = useMemo(() => calculateTotalIncome(filteredTransactions), [filteredTransactions]);
  const totalExpenses = useMemo(() => calculateTotalExpenses(filteredTransactions), [filteredTransactions]);
  const remainingBalance = useMemo(
    () => calculateRemainingBalance(totalIncome, totalExpenses),
    [totalIncome, totalExpenses]
  );
  const budgetUtilization = useMemo(
    () => calculateBudgetUtilization(totalExpenses, monthlyBudget),
    [totalExpenses, monthlyBudget]
  );
  const categoryExpenses = useMemo(
    () => calculateCategoryExpenses(filteredTransactions),
    [filteredTransactions]
  );

  // 6-month trend comparison
  const monthlyTrends = useMemo(() => calculateMonthlyTrends(transactions, 6), [transactions]);

  // Recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5);
  }, [filteredTransactions]);

  const isOverBudget = monthlyBudget > 0 && totalExpenses > monthlyBudget;
  const isNearLimit = monthlyBudget > 0 && budgetUtilization >= 80 && !isOverBudget;
  const isNegativeBalance = remainingBalance < 0;

  // Empty state if total transactions is 0
  if (transactions.length === 0) {
    return (
      <div className="page-content">
        <div className="empty-state" style={{ minHeight: '60vh', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '60px 24px' }}>
          <div className="empty-state-icon" style={{ background: '#eff6ff', color: '#2563eb', width: '80px', height: '80px' }}>
            <Wallet size={40} />
          </div>
          <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Welcome to BudgetWise</h3>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '480px', marginBottom: '28px' }}>
            Take control of your personal finances. Track your income, manage daily expenses, and stay within your budget effortlessly.
          </p>
          <div className="empty-state-actions">
            <button className="btn btn-primary" onClick={onOpenAddTransaction}>
              <PlusCircle size={16} />
              <span>Add First Transaction</span>
            </button>
            <button className="btn btn-secondary" onClick={onOpenDemoPrompt}>
              <Sparkles size={16} color="#0d9488" />
              <span>Explore With Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Warning Banners */}
      {isOverBudget && (
        <div className="alert-banner alert-danger" role="alert">
          <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div className="alert-banner-content">
            <h4>Budget Exceeded Alert</h4>
            <p>
              Your total expenses of <strong>{formatCurrency(totalExpenses)}</strong> have exceeded your monthly budget of{' '}
              <strong>{formatCurrency(monthlyBudget)}</strong> by{' '}
              <strong>{formatCurrency(totalExpenses - monthlyBudget)}</strong> ({budgetUtilization}% utilization).
            </p>
          </div>
        </div>
      )}

      {isNearLimit && (
        <div className="alert-banner alert-warning" role="alert">
          <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div className="alert-banner-content">
            <h4>Budget Threshold Warning</h4>
            <p>
              You have utilized <strong>{budgetUtilization}%</strong> of your monthly budget of{' '}
              <strong>{formatCurrency(monthlyBudget)}</strong>. Only{' '}
              <strong>{formatCurrency(monthlyBudget - totalExpenses)}</strong> remains.
            </p>
          </div>
        </div>
      )}

      {/* 5 Financial Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          subtext={selectedMonth === 'all' ? 'All recorded income' : `For ${formatMonthName(selectedMonth)}`}
          icon={TrendingUp}
          variant="income"
        />

        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          subtext={selectedMonth === 'all' ? 'All recorded expenses' : `For ${formatMonthName(selectedMonth)}`}
          icon={TrendingDown}
          variant="expense"
        />

        <SummaryCard
          title="Remaining Balance"
          value={formatCurrency(remainingBalance)}
          subtext={isNegativeBalance ? 'Expenses exceed income!' : 'Net savings & liquidity'}
          icon={PiggyBank}
          variant="balance"
        />

        <SummaryCard
          title="Monthly Budget"
          value={formatCurrency(monthlyBudget)}
          subtext="Target spending limit"
          icon={Wallet}
          variant="budget"
        />

        <SummaryCard
          title="Budget Utilization"
          value={`${budgetUtilization}%`}
          subtext={isOverBudget ? 'Over allocated budget' : `${formatCurrency(Math.max(monthlyBudget - totalExpenses, 0))} remaining`}
          icon={Percent}
          variant="utilization"
        />
      </div>

      {/* Visual Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Income vs Expenses Trend</h3>
              <span className="chart-subtitle">6-Month historical comparison</span>
            </div>
          </div>
          <div className="chart-body">
            <IncomeExpenseChart data={monthlyTrends} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Expense by Category</h3>
              <span className="chart-subtitle">
                {selectedMonth === 'all' ? 'Overall distribution' : formatMonthName(selectedMonth)}
              </span>
            </div>
          </div>
          <div className="chart-body">
            <ExpenseChart categoryExpenses={categoryExpenses} />
          </div>
        </div>
      </div>

      {/* Budget Progress & Allocations */}
      <BudgetProgress
        totalExpenses={totalExpenses}
        monthlyBudget={monthlyBudget}
        categoryBudgets={categoryBudgets}
        categoryExpenses={categoryExpenses}
        onOpenEditMonthlyBudget={onOpenEditMonthlyBudget}
        onOpenAddCategoryBudget={onOpenAddCategoryBudget}
        onOpenEditCategoryBudget={onOpenEditCategoryBudget}
        onDeleteCategoryBudget={onDeleteCategoryBudget}
        showCategoryManager={false}
      />

      {/* Recent Transactions Section */}
      <div className="transactions-section">
        <div className="chart-header" style={{ marginBottom: '14px' }}>
          <div>
            <h3>Recent Transactions</h3>
            <span className="chart-subtitle">Latest 5 financial records</span>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('transactions')}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px' }}>
            <p>No transactions found for the selected month.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className="tx-title-cell">
                        <div className={`tx-icon-badge ${tx.type === 'income' ? 'tx-icon-income' : 'tx-icon-expense'}`}>
                          {tx.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <div className="tx-details">
                          <strong>{tx.title}</strong>
                          {tx.note && <small>{tx.note}</small>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{tx.category}</span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '13.5px' }}>
                      {formatDate(tx.date)}
                    </td>
                    <td className={`amount-cell ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn-icon"
                          onClick={() => onOpenEditTransaction(tx)}
                          title="Edit transaction"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ color: '#ef4444' }}
                          onClick={() => onOpenDeleteTransaction(tx)}
                          title="Delete transaction"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
