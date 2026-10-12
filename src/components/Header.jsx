import React from 'react';
import { Menu, Plus, Calendar } from 'lucide-react';
import { formatMonthName } from '../utils/formatters';

export default function Header({
  activeTab,
  selectedMonth,
  setSelectedMonth,
  availableMonths,
  onOpenAddTransaction,
  setMobileOpen,
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Financial Dashboard', subtitle: 'Overview of your income, expenses & budgets' };
      case 'transactions':
        return { title: 'Transaction History', subtitle: 'Manage, filter and review all recorded entries' };
      case 'budgets':
        return { title: 'Monthly Budget Planner', subtitle: 'Set and track spending limits by category' };
      case 'analytics':
        return { title: 'Financial Analytics', subtitle: 'Visual insights, monthly comparisons & savings rate' };
      default:
        return { title: 'BudgetWise', subtitle: 'Personal Finance Manager' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="header-title">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="month-picker-container" title="Filter data by month">
          <Calendar size={16} color="#64748b" />
          <select
            className="month-picker-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            aria-label="Select month"
          >
            <option value="all">All Months</option>
            {availableMonths.map((mStr) => (
              <option key={mStr} value={mStr}>
                {formatMonthName(mStr)}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={onOpenAddTransaction}
        >
          <Plus size={16} />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
}
