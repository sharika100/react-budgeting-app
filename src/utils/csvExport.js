// CSV export utility for BudgetWise transactions

export function exportTransactionsToCSV(transactions = [], filename = 'budgetwise_transactions.csv') {
  if (!transactions || transactions.length === 0) {
    throw new Error('No transactions available to export.');
  }

  const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount (INR)', 'Notes'];

  const rows = transactions.map((tx) => {
    const sanitize = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    return [
      sanitize(tx.id),
      sanitize(tx.date),
      sanitize(tx.type?.toUpperCase()),
      sanitize(tx.category),
      sanitize(tx.title),
      sanitize(Number(tx.amount || 0).toFixed(2)),
      sanitize(tx.note || ''),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
