import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/storage';

function TransactionFormInner({ onClose, onSave, initialData }) {
  const isEditing = Boolean(initialData && initialData.id);

  const [type, setType] = useState(() => initialData?.type || 'expense');
  const [title, setTitle] = useState(() => initialData?.title || '');
  const [amount, setAmount] = useState(() => (initialData?.amount ? String(initialData.amount) : ''));
  const [category, setCategory] = useState(() => initialData?.category || EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(() => initialData?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(() => initialData?.note || '');
  const [errors, setErrors] = useState({});

  const handleTypeChange = (newType) => {
    setType(newType);
    const validCats = newType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!validCats.includes(category)) {
      setCategory(validCats[0]);
    }
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Transaction title or description is required.';
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Please enter a valid positive monetary amount (e.g., 500).';
    }

    if (!category) {
      errs.category = 'Please select a category.';
    }

    if (!date) {
      errs.date = 'Please select a valid date.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const transactionPayload = {
      id: initialData?.id || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      title: title.trim(),
      amount: parseFloat(Number(amount).toFixed(2)),
      category,
      date,
      note: note.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(transactionPayload);
    onClose();
  };

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{isEditing ? 'Edit Transaction' : 'Record New Transaction'}</h3>
        <button className="btn-icon" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {/* Type selector toggle */}
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <div className="type-toggle-container">
              <button
                type="button"
                className={`type-toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
                onClick={() => handleTypeChange('expense')}
              >
                <ArrowDownRight size={18} />
                <span>Expense</span>
              </button>
              <button
                type="button"
                className={`type-toggle-btn ${type === 'income' ? 'active-income' : ''}`}
                onClick={() => handleTypeChange('income')}
              >
                <ArrowUpRight size={18} />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Description / Title */}
          <div className="form-group">
            <label className="form-label required" htmlFor="tx-title">
              Description / Title
            </label>
            <input
              id="tx-title"
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Monthly Grocery Restock, Salary, House Rent"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              autoFocus
            />
            {errors.title && <div className="form-error-msg">{errors.title}</div>}
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label required" htmlFor="tx-amount">
              Amount (₹)
            </label>
            <input
              id="tx-amount"
              type="number"
              step="any"
              min="0.01"
              className={`form-input ${errors.amount ? 'error' : ''}`}
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
              }}
            />
            {errors.amount && <div className="form-error-msg">{errors.amount}</div>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label required" htmlFor="tx-category">
              Category
            </label>
            <select
              id="tx-category"
              className={`form-select ${errors.category ? 'error' : ''}`}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
              }}
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <div className="form-error-msg">{errors.category}</div>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label required" htmlFor="tx-date">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              className={`form-input ${errors.date ? 'error' : ''}`}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
              }}
            />
            {errors.date && <div className="form-error-msg">{errors.date}</div>}
          </div>

          {/* Optional Note */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-note">
              Optional Notes
            </label>
            <input
              id="tx-note"
              type="text"
              className="form-input"
              placeholder="Additional details, payment mode, invoice reference"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TransactionFormModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) {
  if (!isOpen) return null;

  // Use a key based on initialData id so when the modal opens or target changes, state cleanly re-initializes
  const key = initialData ? `edit-${initialData.id}` : 'new-transaction';

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <TransactionFormInner
        key={key}
        onClose={onClose}
        onSave={onSave}
        initialData={initialData}
      />
    </div>
  );
}
