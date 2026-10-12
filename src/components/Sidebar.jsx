import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  BarChart3,
  Wallet,
  Download,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  onOpenDemoPrompt,
  onOpenResetPrompt,
  onExportCSV,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'budgets', label: 'Budget Planner', icon: PieChart },
    { id: 'analytics', label: 'Reports & Trends', icon: BarChart3 },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <Wallet size={22} />
            </div>
            <div className="brand-text">
              <h1>BudgetWise</h1>
              <p>Budget Manager</p>
            </div>
          </div>
          {mobileOpen && (
            <button
              className="btn-icon"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{ color: '#fff' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="quick-action-btn"
            onClick={onExportCSV}
            title="Download CSV report of transactions"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={onOpenDemoPrompt}
            title="Populate realistic demo transactions"
          >
            <Sparkles size={15} />
            <span>Load Demo Data</span>
          </button>
          <button
            className="quick-action-btn danger-action"
            onClick={onOpenResetPrompt}
            title="Reset and clear all saved data"
          >
            <RotateCcw size={15} />
            <span>Reset Data</span>
          </button>
        </div>
      </aside>
    </>
  );
}
