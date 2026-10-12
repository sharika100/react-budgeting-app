import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { CATEGORY_COLORS } from '../utils/storage';

const fallbackColors = [
  '#f97316', '#10b981', '#3b82f6', '#6366f1', '#06b6d4',
  '#ec4899', '#8b5cf6', '#f43f5e', '#eab308', '#14b8a6',
];

function ExpenseCustomTooltip({ active, payload, total }) {
  if (active && payload && payload.length) {
    const item = payload[0];
    const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
    return (
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12.5px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        }}
      >
        <p style={{ fontWeight: 600, color: item.payload.fill }}>{item.name}</p>
        <p style={{ margin: '2px 0' }}>{formatCurrency(item.value)}</p>
        <p style={{ color: '#94a3b8', fontSize: '11.5px' }}>{pct}% of expenses</p>
      </div>
    );
  }
  return null;
}

export default function ExpenseChart({ categoryExpenses = {} }) {
  const data = Object.entries(categoryExpenses)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0 || total === 0) {
    return (
      <div className="empty-state" style={{ height: '280px' }}>
        <p>No expense transactions recorded for the selected period.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => {
              const color = CATEGORY_COLORS[entry.name] || fallbackColors[index % fallbackColors.length];
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip content={<ExpenseCustomTooltip total={total} />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
