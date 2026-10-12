import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../utils/storage';

function CategoryBudgetModalInner({
  onClose,
  onSaveCategoryBudget,
  onSaveMonthlyBudget,
  mode,
  initialCategory,
  initialAmount,
}) {
  const [category, setCategory] = useState(() => initialCategory || EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState(() => (initialAmount ? String(initialAmount) : ''));
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!amount || isNaN(num) || num < 0) {
      setError('Please enter a valid positive budget amount.');
      return;
    }

    if (mode === 'monthly') {
      onSaveMonthlyBudget(num);
    } else {
      onSaveCategoryBudget(category, num);
    }
    onClose();
  };

  return (
    <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>
          {mode === 'monthly'
            ? 'Set Overall Monthly Budget'
            : initialCategory
            ? `Edit ${initialCategory} Budget`
            : 'Add Category Budget'}
        </h3>
        <button className="btn-icon" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {mode === 'category' && (
            <div className="form-group">
              <label className="form-label required" htmlFor="budget-cat">
                Expense Category
              </label>
              <select
                id="budget-cat"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={Boolean(initialCategory)}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label required" htmlFor="budget-amt">
              Monthly Budget Amount (₹)
            </label>
            <input
              id="budget-amt"
              type="number"
              step="any"
              min="0"
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
            {error && <div className="form-error-msg">{error}</div>}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Budget
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CategoryBudgetModal({
  isOpen,
  onClose,
  onSaveCategoryBudget,
  onSaveMonthlyBudget,
  mode = 'category',
  initialCategory = '',
  initialAmount = '',
}) {
  if (!isOpen) return null;

  const key = `${mode}-${initialCategory}-${initialAmount}`;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <CategoryBudgetModalInner
        key={key}
        onClose={onClose}
        onSaveCategoryBudget={onSaveCategoryBudget}
        onSaveMonthlyBudget={onSaveMonthlyBudget}
        mode={mode}
        initialCategory={initialCategory}
        initialAmount={initialAmount}
      />
    </div>
  );
}
