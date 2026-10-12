import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import TransactionFormModal from './components/TransactionFormModal';
import CategoryBudgetModal from './components/CategoryBudgetModal';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import ReportsPage from './pages/ReportsPage';
import {
  loadTransactions,
  saveTransactions,
  loadMonthlyBudget,
  saveMonthlyBudget,
  loadCategoryBudgets,
  saveCategoryBudgets,
  getDemoTransactions,
  DEFAULT_CATEGORY_BUDGETS,
  DEFAULT_MONTHLY_BUDGET,
  clearAllData,
} from './utils/storage';
import { getCurrentMonthStr, getAvailableMonths } from './utils/formatters';
import { exportTransactionsToCSV } from './utils/csvExport';

export default function App() {
  // Primary state loaded from LocalStorage
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const [monthlyBudget, setMonthlyBudget] = useState(() => loadMonthlyBudget());
  const [categoryBudgets, setCategoryBudgets] = useState(() => loadCategoryBudgets());

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonthStr());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Modals state
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [budgetModal, setBudgetModal] = useState({
    isOpen: false,
    mode: 'monthly', // 'monthly' | 'category'
    category: '',
    amount: '',
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDanger: false,
    onConfirm: () => {},
  });

  // Sync state to LocalStorage
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveMonthlyBudget(monthlyBudget);
  }, [monthlyBudget]);

  useEffect(() => {
    saveCategoryBudgets(categoryBudgets);
  }, [categoryBudgets]);

  // Toast Helper
  const showToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Available months list derived from transactions
  const availableMonths = useMemo(() => {
    return getAvailableMonths(transactions);
  }, [transactions]);

  // Transaction Actions
  const handleOpenAddTransaction = () => {
    setEditingTransaction(null);
    setTxModalOpen(true);
  };

  const handleOpenEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setTxModalOpen(true);
  };

  const handleSaveTransaction = (savedTx) => {
    setTransactions((prev) => {
      const exists = prev.some((item) => item.id === savedTx.id);
      if (exists) {
        return prev.map((item) => (item.id === savedTx.id ? savedTx : item));
      }
      return [savedTx, ...prev];
    });

    showToast(
      editingTransaction ? 'Transaction updated successfully!' : 'New transaction added!'
    );
  };

  const handleOpenDeleteTransaction = (tx) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Transaction',
      message: `Are you sure you want to delete "${tx.title}" of ₹${tx.amount}? This action cannot be undone.`,
      confirmText: 'Delete',
      isDanger: true,
      onConfirm: () => {
        setTransactions((prev) => prev.filter((item) => item.id !== tx.id));
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
        showToast('Transaction deleted successfully.', 'info');
      },
    });
  };

  // Budget Actions
  const handleOpenEditMonthlyBudget = () => {
    setBudgetModal({
      isOpen: true,
      mode: 'monthly',
      category: '',
      amount: monthlyBudget,
    });
  };

  const handleOpenAddCategoryBudget = () => {
    setBudgetModal({
      isOpen: true,
      mode: 'category',
      category: '',
      amount: '',
    });
  };

  const handleOpenEditCategoryBudget = (category, currentAmount) => {
    setBudgetModal({
      isOpen: true,
      mode: 'category',
      category,
      amount: currentAmount,
    });
  };

  const handleSaveMonthlyBudget = (amount) => {
    setMonthlyBudget(amount);
    showToast(`Monthly budget updated to ₹${amount.toLocaleString('en-IN')}`);
  };

  const handleSaveCategoryBudget = (category, amount) => {
    setCategoryBudgets((prev) => ({
      ...prev,
      [category]: amount,
    }));
    showToast(`Budget for "${category}" set to ₹${amount.toLocaleString('en-IN')}`);
  };

  const handleDeleteCategoryBudget = (category) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Category Budget',
      message: `Are you sure you want to remove the budget allocation for "${category}"?`,
      confirmText: 'Remove Budget',
      isDanger: true,
      onConfirm: () => {
        setCategoryBudgets((prev) => {
          const next = { ...prev };
          delete next[category];
          return next;
        });
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
        showToast(`Budget for "${category}" removed.`, 'info');
      },
    });
  };

  // Demo Data & Reset Actions
  const handleOpenDemoPrompt = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Load Realistic Demo Data?',
      message:
        'This will populate BudgetWise with sample income, expenses, and category budgets for the current and prior months. Existing records will be supplemented.',
      confirmText: 'Load Demo Data',
      isDanger: false,
      onConfirm: () => {
        const demo = getDemoTransactions();
        setTransactions(demo);
        setMonthlyBudget(DEFAULT_MONTHLY_BUDGET);
        setCategoryBudgets(DEFAULT_CATEGORY_BUDGETS);
        setSelectedMonth(getCurrentMonthStr());
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
        showToast('Demo data loaded successfully!');
      },
    });
  };

  const handleOpenResetPrompt = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset All Application Data?',
      message:
        'WARNING: This will permanently erase all transactions, category budgets, and budget preferences from your local storage. This action cannot be reversed.',
      confirmText: 'Reset Everything',
      isDanger: true,
      onConfirm: () => {
        clearAllData();
        setTransactions([]);
        setMonthlyBudget(DEFAULT_MONTHLY_BUDGET);
        setCategoryBudgets(DEFAULT_CATEGORY_BUDGETS);
        setConfirmDialog((c) => ({ ...c, isOpen: false }));
        showToast('All application data has been reset.', 'info');
      },
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    try {
      if (transactions.length === 0) {
        showToast('No transactions to export yet.', 'error');
        return;
      }
      exportTransactionsToCSV(transactions, `budgetwise_transactions_${selectedMonth}.csv`);
      showToast('Transactions exported to CSV successfully!');
    } catch (err) {
      showToast(err.message || 'Error exporting to CSV', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        isDanger={confirmDialog.isDanger}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((c) => ({ ...c, isOpen: false }))}
      />

      {/* Add / Edit Transaction Modal */}
      <TransactionFormModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
      />

      {/* Budget Set / Edit Modal */}
      <CategoryBudgetModal
        isOpen={budgetModal.isOpen}
        onClose={() => setBudgetModal((b) => ({ ...b, isOpen: false }))}
        mode={budgetModal.mode}
        initialCategory={budgetModal.category}
        initialAmount={budgetModal.amount}
        onSaveMonthlyBudget={handleSaveMonthlyBudget}
        onSaveCategoryBudget={handleSaveCategoryBudget}
      />

      {/* Desktop & Mobile Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenDemoPrompt={handleOpenDemoPrompt}
        onOpenResetPrompt={handleOpenResetPrompt}
        onExportCSV={handleExportCSV}
      />

      {/* Main Content Viewport */}
      <div className="main-wrapper">
        <Header
          activeTab={activeTab}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          availableMonths={availableMonths}
          onOpenAddTransaction={handleOpenAddTransaction}
          setMobileOpen={setMobileOpen}
        />

        <main>
          {activeTab === 'dashboard' && (
            <Dashboard
              transactions={transactions}
              monthlyBudget={monthlyBudget}
              categoryBudgets={categoryBudgets}
              selectedMonth={selectedMonth}
              onOpenAddTransaction={handleOpenAddTransaction}
              onOpenEditTransaction={handleOpenEditTransaction}
              onOpenDeleteTransaction={handleOpenDeleteTransaction}
              onOpenEditMonthlyBudget={handleOpenEditMonthlyBudget}
              onOpenAddCategoryBudget={handleOpenAddCategoryBudget}
              onOpenEditCategoryBudget={handleOpenEditCategoryBudget}
              onDeleteCategoryBudget={handleDeleteCategoryBudget}
              onOpenDemoPrompt={handleOpenDemoPrompt}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsPage
              transactions={transactions}
              onOpenAddTransaction={handleOpenAddTransaction}
              onOpenEditTransaction={handleOpenEditTransaction}
              onOpenDeleteTransaction={handleOpenDeleteTransaction}
              onExportCSV={handleExportCSV}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsPage
              transactions={transactions}
              monthlyBudget={monthlyBudget}
              categoryBudgets={categoryBudgets}
              selectedMonth={selectedMonth}
              onOpenEditMonthlyBudget={handleOpenEditMonthlyBudget}
              onOpenAddCategoryBudget={handleOpenAddCategoryBudget}
              onOpenEditCategoryBudget={handleOpenEditCategoryBudget}
              onDeleteCategoryBudget={handleDeleteCategoryBudget}
            />
          )}

          {activeTab === 'analytics' && (
            <ReportsPage transactions={transactions} />
          )}
        </main>
      </div>
    </div>
  );
}
