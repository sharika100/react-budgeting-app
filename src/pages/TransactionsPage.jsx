import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
} from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionsPage({
  transactions = [],
  onOpenAddTransaction,
  onOpenEditTransaction,
  onOpenDeleteTransaction,
  onExportCSV,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

  // Combine categories for filter dropdown
  const allCategories = useMemo(() => {
    return Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])).sort();
  }, []);

  // Filter & search & sort logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Type filter
        if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

        // Category filter
        if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;

        // Search term (title, notes, or category)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = (tx.title || '').toLowerCase().includes(q);
          const matchNote = (tx.note || '').toLowerCase().includes(q);
          const matchCategory = (tx.category || '').toLowerCase().includes(q);
          if (!matchTitle && !matchNote && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date || 0) - new Date(a.date || 0);
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date || 0) - new Date(b.date || 0);
        }
        if (sortBy === 'amount-desc') {
          return Number(b.amount || 0) - Number(a.amount || 0);
        }
        if (sortBy === 'amount-asc') {
          return Number(a.amount || 0) - Number(b.amount || 0);
        }
        return 0;
      });
  }, [transactions, searchTerm, typeFilter, categoryFilter, sortBy]);

  // Summaries of filtered set
  const filteredIncome = useMemo(() => {
    return filteredTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  }, [filteredTransactions]);

  const filteredExpenses = useMemo(() => {
    return filteredTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  }, [filteredTransactions]);

  const filteredNet = filteredIncome - filteredExpenses;

  return (
    <div className="page-content">
      {/* Overview stats for filtered results */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Filtered Income
          </span>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
            +{formatCurrency(filteredIncome)}
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Filtered Expenses
          </span>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444', marginTop: '4px' }}>
            -{formatCurrency(filteredExpenses)}
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Net Result
          </span>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: filteredNet >= 0 ? '#2563eb' : '#ef4444',
              marginTop: '4px',
            }}
          >
            {formatCurrency(filteredNet)}
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Records
          </span>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
            {filteredTransactions.length} of {transactions.length}
          </div>
        </div>
      </div>

      <div className="transactions-section">
        {/* Toolbar */}
        <div className="transactions-toolbar">
          <div className="search-box">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search description, notes, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search transactions"
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by transaction type"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>

            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort transactions"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
            </select>

            <button
              className="btn btn-secondary btn-sm"
              onClick={onExportCSV}
              title="Download CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={onOpenAddTransaction}
            >
              <Plus size={14} />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        {filteredTransactions.length === 0 ? (
          <div className="empty-state" style={{ padding: '50px 20px' }}>
            <p>
              {transactions.length === 0
                ? 'No transactions recorded yet.'
                : 'No transactions match the selected filters or search keyword.'}
            </p>
            {transactions.length > 0 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                }}
                style={{ marginTop: '10px' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Description & Notes</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className="tx-title-cell">
                        <div
                          className={`tx-icon-badge ${
                            tx.type === 'income' ? 'tx-icon-income' : 'tx-icon-expense'
                          }`}
                        >
                          {tx.type === 'income' ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                        </div>
                        <div className="tx-details">
                          <strong>{tx.title}</strong>
                          {tx.note && <small>{tx.note}</small>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          color: tx.type === 'income' ? '#059669' : '#dc2626',
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td>
                      <span className="category-tag">{tx.category}</span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '13.5px' }}>
                      {formatDate(tx.date)}
                    </td>
                    <td
                      className={`amount-cell ${
                        tx.type === 'income' ? 'amount-income' : 'amount-expense'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon"
                          onClick={() => onOpenEditTransaction(tx)}
                          title="Edit transaction"
                          aria-label={`Edit ${tx.title}`}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ color: '#ef4444' }}
                          onClick={() => onOpenDeleteTransaction(tx)}
                          title="Delete transaction"
                          aria-label={`Delete ${tx.title}`}
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
