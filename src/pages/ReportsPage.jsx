import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
} from 'lucide-react';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import ExpenseChart from '../components/ExpenseChart';
import {
  calculateMonthlyTrends,
  calculateCategoryExpenses,
  calculateTotalIncome,
  calculateTotalExpenses,
} from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

export default function ReportsPage({ transactions = [] }) {
  const trends = useMemo(() => calculateMonthlyTrends(transactions, 12), [transactions]);
  const categoryExpenses = useMemo(() => calculateCategoryExpenses(transactions), [transactions]);
  const totalIncomeAll = useMemo(() => calculateTotalIncome(transactions), [transactions]);
  const totalExpensesAll = useMemo(() => calculateTotalExpenses(transactions), [transactions]);

  const overallSavingsRate =
    totalIncomeAll > 0
      ? Math.max(0, (((totalIncomeAll - totalExpensesAll) / totalIncomeAll) * 100).toFixed(1))
      : 0;

  // Sorted categories
  const sortedCategories = useMemo(() => {
    return Object.entries(categoryExpenses)
      .map(([cat, amt]) => ({
        category: cat,
        amount: amt,
        percentage: totalExpensesAll > 0 ? ((amt / totalExpensesAll) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [categoryExpenses, totalExpensesAll]);

  return (
    <div className="page-content">
      {/* High level metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '24px',
        }}
      >
        <div className="summary-card">
          <div className="card-top">
            <span className="card-title">Lifetime Income</span>
            <div className="card-icon income">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="card-value">{formatCurrency(totalIncomeAll)}</div>
          <div className="card-subtext">Total across all records</div>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span className="card-title">Lifetime Expenses</span>
            <div className="card-icon expense">
              <TrendingDown size={18} />
            </div>
          </div>
          <div className="card-value">{formatCurrency(totalExpensesAll)}</div>
          <div className="card-subtext">Total across all records</div>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span className="card-title">Overall Savings Rate</span>
            <div className="card-icon balance">
              <Percent size={18} />
            </div>
          </div>
          <div className="card-value">{overallSavingsRate}%</div>
          <div className="card-subtext">Net savings ratio</div>
        </div>
      </div>

      {/* Visual trends */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Annual Income vs Expenses</h3>
              <span className="chart-subtitle">12-month performance</span>
            </div>
          </div>
          <div className="chart-body">
            <IncomeExpenseChart data={trends} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>All-Time Category Breakdown</h3>
              <span className="chart-subtitle">Expense allocation</span>
            </div>
          </div>
          <div className="chart-body">
            <ExpenseChart categoryExpenses={categoryExpenses} />
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="transactions-section" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '14px' }}>
          Monthly Financial Summary
        </h3>

        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Net Savings</th>
                <th>Savings Rate</th>
              </tr>
            </thead>
            <tbody>
              {trends
                .slice()
                .reverse()
                .filter((t) => t.income > 0 || t.expenses > 0)
                .map((row) => {
                  const rate =
                    row.income > 0
                      ? Math.max(0, (((row.income - row.expenses) / row.income) * 100).toFixed(1))
                      : 0;
                  return (
                    <tr key={row.monthKey}>
                      <td>
                        <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#64748b" />
                          {row.month} ({row.monthKey})
                        </strong>
                      </td>
                      <td style={{ color: '#10b981', fontWeight: 600 }}>
                        +{formatCurrency(row.income)}
                      </td>
                      <td style={{ color: '#ef4444', fontWeight: 600 }}>
                        -{formatCurrency(row.expenses)}
                      </td>
                      <td
                        style={{
                          fontWeight: 600,
                          color: row.balance >= 0 ? '#2563eb' : '#ef4444',
                        }}
                      >
                        {formatCurrency(row.balance)}
                      </td>
                      <td>
                        <span
                          className={`cat-badge ${
                            Number(rate) >= 20 ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Expense Categories Ranking */}
      <div className="transactions-section">
        <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '14px' }}>
          Top Expense Categories
        </h3>

        {sortedCategories.length === 0 ? (
          <p style={{ color: '#64748b', padding: '20px' }}>No expense records available.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedCategories.map((item, idx) => (
              <div
                key={item.category}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: idx === 0 ? '#fef3c7' : '#e2e8f0',
                      color: idx === 0 ? '#b45309' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <strong style={{ fontSize: '14.5px' }}>{item.category}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    {item.percentage}% of all expenses
                  </span>
                  <strong style={{ fontSize: '15px', color: '#0f172a' }}>
                    {formatCurrency(item.amount)}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
