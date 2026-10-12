import React, { useMemo } from 'react';
import {
  Wallet,
  Edit2,
  AlertTriangle,
  AlertCircle,
  PieChart as PieIcon,
} from 'lucide-react';
import BudgetProgress from '../components/BudgetProgress';
import {
  calculateTotalExpenses,
  calculateCategoryExpenses,
  calculateCategoryBudgetStatus,
  filterTransactionsByMonth,
} from '../utils/calculations';
import { formatCurrency, formatMonthName } from '../utils/formatters';

export default function BudgetsPage({
  transactions = [],
  monthlyBudget,
  categoryBudgets = {},
  selectedMonth,
  onOpenEditMonthlyBudget,
  onOpenAddCategoryBudget,
  onOpenEditCategoryBudget,
  onDeleteCategoryBudget,
}) {
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByMonth(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  const totalExpenses = useMemo(
    () => calculateTotalExpenses(filteredTransactions),
    [filteredTransactions]
  );

  const categoryExpenses = useMemo(
    () => calculateCategoryExpenses(filteredTransactions),
    [filteredTransactions]
  );

  const categoryStatuses = useMemo(
    () => calculateCategoryBudgetStatus(categoryBudgets, categoryExpenses),
    [categoryBudgets, categoryExpenses]
  );

  const totalAllocatedBudget = useMemo(() => {
    return Object.values(categoryBudgets).reduce((sum, val) => sum + (Number(val) || 0), 0);
  }, [categoryBudgets]);

  const overBudgetCategories = categoryStatuses.filter((s) => s.isOverBudget);
  const nearLimitCategories = categoryStatuses.filter((s) => s.isNearLimit);

  return (
    <div className="page-content">
      {/* Top Warning Alert if any category is exceeded */}
      {overBudgetCategories.length > 0 && (
        <div className="alert-banner alert-danger">
          <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div className="alert-banner-content">
            <h4>Category Budget Exceeded!</h4>
            <p>
              The following categories have surpassed their monthly spending targets:{' '}
              {overBudgetCategories.map((c) => (
                <strong key={c.category}>{c.category} (+{formatCurrency(Math.abs(c.remaining))}), </strong>
              ))}
              Review expenses to stay on track.
            </p>
          </div>
        </div>
      )}

      {nearLimitCategories.length > 0 && (
        <div className="alert-banner alert-warning">
          <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div className="alert-banner-content">
            <h4>Approaching Category Budget Limits</h4>
            <p>
              Categories nearing the 80% ceiling:{' '}
              {nearLimitCategories.map((c) => (
                <strong key={c.category}>{c.category} ({c.percentage}%), </strong>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* Top Budget Configuration Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '18px',
          marginBottom: '24px',
        }}
      >
        <div className="summary-card">
          <div className="card-top">
            <span className="card-title">Overall Monthly Limit</span>
            <button
              className="btn-icon"
              onClick={onOpenEditMonthlyBudget}
              title="Edit overall budget"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <div className="card-value">{formatCurrency(monthlyBudget)}</div>
          <div className="card-subtext">Total cap for all expenses</div>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span className="card-title">Total Category Allocations</span>
            <div className="card-icon budget">
              <PieIcon size={18} />
            </div>
          </div>
          <div className="card-value">{formatCurrency(totalAllocatedBudget)}</div>
          <div className="card-subtext">
            {Object.keys(categoryBudgets).length} active category budgets
          </div>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <span className="card-title">Expenses Logged</span>
            <div className="card-icon expense">
              <Wallet size={18} />
            </div>
          </div>
          <div className="card-value">{formatCurrency(totalExpenses)}</div>
          <div className="card-subtext">
            {selectedMonth === 'all' ? 'All recorded expenses' : `In ${formatMonthName(selectedMonth)}`}
          </div>
        </div>
      </div>

      {/* Category Budget Section with full management */}
      <BudgetProgress
        totalExpenses={totalExpenses}
        monthlyBudget={monthlyBudget}
        categoryBudgets={categoryBudgets}
        categoryExpenses={categoryExpenses}
        onOpenEditMonthlyBudget={onOpenEditMonthlyBudget}
        onOpenAddCategoryBudget={onOpenAddCategoryBudget}
        onOpenEditCategoryBudget={onOpenEditCategoryBudget}
        onDeleteCategoryBudget={onDeleteCategoryBudget}
        showCategoryManager={true}
      />
    </div>
  );
}
