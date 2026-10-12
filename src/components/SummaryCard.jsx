import React from 'react';

export default function SummaryCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'balance', // 'income' | 'expense' | 'balance' | 'budget' | 'utilization'
}) {
  return (
    <div className="summary-card">
      <div className="card-top">
        <span className="card-title">{title}</span>
        <div className={`card-icon ${variant}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="card-value">{value}</div>
      {subtext && <div className="card-subtext">{subtext}</div>}
    </div>
  );
}
