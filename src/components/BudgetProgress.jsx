import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Plus, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function BudgetProgress({
  totalExpenses,
  monthlyBudget,
  categoryBudgets = {},
  categoryExpenses = {},
  onOpenEditMonthlyBudget,
  onOpenAddCategoryBudget,
  onOpenEditCategoryBudget,
  onDeleteCategoryBudget,
  showCategoryManager = false,
}) {
  const overallUtilization = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;
  const overallRemaining = monthlyBudget - totalExpenses;
  const isOverallOver = monthlyBudget > 0 && totalExpenses > monthlyBudget;
  const isOverallNearLimit = monthlyBudget > 0 && overallUtilization >= 80 && !isOverallOver;

  // Compile category list
  const allCategories = Array.from(
    new Set([...Object.keys(categoryBudgets), ...Object.keys(categoryExpenses)])
  );

  return (
    <div className="budget-progress-section">
      <div className="budget-progress-header">
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Monthly Budget Overview</h3>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Overall spending limits and category allocations
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onOpenEditMonthlyBudget && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenEditMonthlyBudget}
            >
              <Edit2 size={14} />
              <span>Set Total Budget</span>
            </button>
          )}
          {onOpenAddCategoryBudget && (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={onOpenAddCategoryBudget}
            >
              <Plus size={14} />
              <span>Add Category Budget</span>
            </button>
          )}
        </div>
      </div>

      {/* Overall Budget Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            Total Budget Spent: {formatCurrency(totalExpenses)} of {formatCurrency(monthlyBudget)}
          </span>
          <span
            style={{
              fontSize: '13.5px',
              fontWeight: 600,
              color: isOverallOver ? '#ef4444' : isOverallNearLimit ? '#f59e0b' : '#0d9488',
            }}
          >
            {overallUtilization.toFixed(1)}% Used
          </span>
        </div>

        <div className="progress-bar-container">
          <div
            className={`progress-bar-fill ${
              isOverallOver ? 'danger' : isOverallNearLimit ? 'warning' : 'normal'
            }`}
            style={{ width: `${Math.min(overallUtilization, 100)}%` }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
          <span>
            {isOverallOver ? (
              <span style={{ color: '#ef4444', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={14} /> Budget Exceeded by {formatCurrency(Math.abs(overallRemaining))}
              </span>
            ) : (
              <span>Remaining: <strong>{formatCurrency(overallRemaining)}</strong></span>
            )}
          </span>
          <span>
            {isOverallNearLimit && (
              <span style={{ color: '#f59e0b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={14} /> Approaching Budget Limit (&gt;= 80%)
              </span>
            )}
            {!isOverallNearLimit && !isOverallOver && (
              <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> On Track
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>
        Category Budget Allocations
      </h4>

      {allCategories.length === 0 ? (
        <div className="empty-state" style={{ padding: '20px' }}>
          <p>No category budgets configured yet. Click "Add Category Budget" to track category limits.</p>
        </div>
      ) : (
        <div className="category-budget-list">
          {allCategories.map((category) => {
            const budget = Number(categoryBudgets[category]) || 0;
            const spent = Number(categoryExpenses[category]) || 0;
            const remaining = budget - spent;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const isOver = budget > 0 && spent > budget;
            const isNear = budget > 0 && percentage >= 80 && !isOver;

            return (
              <div key={category} className="category-budget-card">
                <div className="cat-budget-top">
                  <span className="cat-name">{category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {budget > 0 ? (
                      <span
                        className={`cat-badge ${
                          isOver ? 'badge-danger' : isNear ? 'badge-warning' : 'badge-success'
                        }`}
                      >
                        {isOver ? 'Exceeded' : isNear ? '80%+ Used' : 'On Track'}
                      </span>
                    ) : (
                      <span className="cat-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>
                        No Budget Set
                      </span>
                    )}

                    {showCategoryManager && budget > 0 && (
                      <>
                        <button
                          className="btn-icon"
                          style={{ padding: '4px' }}
                          onClick={() => onOpenEditCategoryBudget(category, budget)}
                          title="Edit budget"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ padding: '4px', color: '#ef4444' }}
                          onClick={() => onDeleteCategoryBudget(category)}
                          title="Delete budget"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {budget > 0 ? (
                  <>
                    <div className="progress-bar-container" style={{ height: '7px' }}>
                      <div
                        className={`progress-bar-fill ${
                          isOver ? 'danger' : isNear ? 'warning' : 'normal'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="cat-budget-amounts">
                      <span>Spent: <strong>{formatCurrency(spent)}</strong></span>
                      <span>Budget: {formatCurrency(budget)}</span>
                    </div>
                    <div className="cat-budget-amounts" style={{ marginTop: '2px' }}>
                      <span style={{ color: isOver ? '#ef4444' : '#64748b' }}>
                        {isOver ? `Over by ${formatCurrency(Math.abs(remaining))}` : `Remaining: ${formatCurrency(remaining)}`}
                      </span>
                      <span style={{ fontWeight: 600 }}>{percentage.toFixed(0)}%</span>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                    Spent so far: <strong>{formatCurrency(spent)}</strong>
                    {onOpenEditCategoryBudget && (
                      <button
                        style={{
                          display: 'block',
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          marginTop: '6px',
                          padding: 0,
                        }}
                        onClick={() => onOpenEditCategoryBudget(category, 5000)}
                      >
                        + Set budget for {category}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
