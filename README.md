# BudgetWise — Personal Budget Manager

BudgetWise is a responsive, production-grade personal budgeting and expense tracking application built with **React.js**, **Vite**, **Recharts**, and **Lucide React**. It allows users to gain full visibility into their personal finances, manage daily income and expenses, establish category budgets with proactive alerts, and export records—all persisted safely in browser `localStorage`.

---

## 🌟 Key Features

### 1. Dynamic Financial Dashboard
- **5 Comprehensive Summary Cards**:
  - **Total Income**: Aggregated strictly from income transactions.
  - **Total Expenses**: Aggregated strictly from expense transactions.
  - **Remaining Balance**: Dynamically calculated as $\text{Total Income} - \text{Total Expenses}$.
  - **Monthly Budget**: Configurable target spending ceiling.
  - **Budget Utilization**: Real-time spending percentage with contextual badges.
- **Strict Distinction**: Income is never miscounted as expenditure or deducted from budget quotas.
- **Proactive Budget Alerts**:
  - ⚠️ Warning banner when monthly or category spending crosses **80%** of budget.
  - 🚨 Urgent alert banner when budget is exceeded (**> 100%**).
- **Interactive Visualizations**:
  - **Income vs Expenses Trend Chart**: Multi-month comparative bar chart using Recharts.
  - **Category Breakdown Donut Chart**: Proportional visual distribution of expenses by category.
- **Recent Activity**: Quick view of the latest 5 transactions with edit and delete shortcuts.

### 2. Transaction Management
- Record **Income** and **Expense** transactions with dedicated category selectors.
- Comprehensive inputs: Title/Description, Positive Amount (₹), Category, Date, and Optional Notes.
- **Search & Filter**: Search transactions by keyword in description, category, or notes. Filter by Type (*Income*, *Expense*, *All*) or Category.
- **Multi-criteria Sorting**: Sort by Date (newest/oldest) or Amount (highest/lowest).
- **Edit & Delete**: Seamless in-place record editing without creating duplicates, and deletion protected by confirmation dialogs.
- **Client-side Form Validation**: Rejects empty fields, negative or zero amounts, and invalid inputs with instant inline feedback.

### 3. Category & Monthly Budget Planner
- Set an overall monthly spending limit.
- Configure category-specific monthly spending budgets (Food, Groceries, Housing, Transportation, Utilities, Healthcare, Shopping, etc.).
- Visual progress bar for each category showing spent amount, remaining balance, and usage percentage.
- Real-time status indicators: **On Track**, **80%+ Used**, or **Exceeded**.

### 4. Data Persistence & Privacy
- Zero backend requirement; 100% client-side privacy via browser `localStorage`.
- Safely initializes on load without overwriting existing data.
- **Demo Data Mode**: Populate realistic, multi-month transactions with one click to explore all features immediately.
- **Reset Data**: Safely reset all data with a double-confirmation prompt.

### 5. Additional Utilities
- **CSV Export**: Export filtered transactions into formatted spreadsheet CSV files.
- **Indian Rupee (₹) Default**: Formatted using the Indian numbering system (`en-IN`).
- **Responsive Layout**: Tailored experience with a desktop dark slate sidebar and mobile-friendly drawer navigation.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI component architecture with Functional Components & Hooks |
| **Vite** | Lightning-fast build tool and development server |
| **Recharts** | Interactive SVG-based data visualizations and charts |
| **Lucide React** | Consistent, lightweight SVG icon system |
| **LocalStorage** | Persistent, client-side data storage |
| **Vitest** | Automated unit testing for financial formulas and calculations |
| **Oxlint** | High-performance linting for code quality and cleanliness |

---

## 📁 Project Structure

```
react-budgeting-app/
├── index.html                   # HTML template with fonts and metadata
├── package.json                 # Project dependencies and npm scripts
├── vite.config.js               # Vite build configuration
├── vercel.json                  # Vercel deployment and SPA routing rules
├── public/
│   └── favicon.svg              # BudgetWise brand SVG icon
├── src/
│   ├── components/
│   │   ├── BudgetProgress.jsx         # Overall & category budget progress bars
│   │   ├── CategoryBudgetModal.jsx    # Modal for configuring budget limits
│   │   ├── ConfirmDialog.jsx          # Accessible confirmation dialog
│   │   ├── ExpenseChart.jsx           # Recharts Donut chart for expense categories
│   │   ├── Header.jsx                 # Top bar with month selector and quick add
│   │   ├── IncomeExpenseChart.jsx     # Recharts Bar chart for income vs expenses
│   │   ├── Sidebar.jsx                # Responsive navigation sidebar
│   │   ├── SummaryCard.jsx            # KPI summary stat card
│   │   ├── Toast.jsx                  # Floating notification banner
│   │   └── TransactionFormModal.jsx   # Add/Edit transaction modal form
│   ├── pages/
│   │   ├── Dashboard.jsx              # Main financial dashboard overview
│   │   ├── TransactionsPage.jsx       # Transaction history with filters & search
│   │   ├── BudgetsPage.jsx            # Category budget planner
│   │   └── ReportsPage.jsx            # Historical trends and savings rate
│   ├── utils/
│   │   ├── __tests__/
│   │   │   └── calculations.test.js   # Vitest unit test suite
│   │   ├── calculations.js            # Core financial formulas and aggregates
│   │   ├── csvExport.js               # CSV generator and file download trigger
│   │   ├── formatters.js              # Currency (₹) and date formatting helpers
│   │   └── storage.js                 # LocalStorage drivers and demo data generator
│   ├── App.jsx                        # Root application component & state sync
│   ├── index.css                      # Design system, theme variables & styles
│   └── main.jsx                       # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher recommended)
- **npm** (v9.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/sharika100/react-budgeting-app.git
cd react-budgeting-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/` to view the application.

### 4. Run Automated Tests
```bash
npm test
```

### 5. Run Linter
```bash
npm run lint
```

### 6. Production Build
```bash
npm run build
```
The compiled, production-ready assets will be created in the `dist/` directory.

---

## 🌐 Deployment to Vercel

### Deploying via Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the interactive prompts:
- **Project Name**: `react-budgeting-app`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Deploying via GitHub Integration
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the `react-budgeting-app` repository.
4. Select the **Vite** preset (Build: `npm run build`, Output Directory: `dist`).
5. Click **Deploy**.

---

## 🧪 Testing Summary

Automated tests cover all financial calculation algorithms:
- Strict income-expense separation.
- Correct calculation of Remaining Balance ($\text{Income} - \text{Expenses}$).
- Category expenditure grouping without leaking income records.
- Budget utilization percentage and threshold detection (80% warning and 100%+ breach).
- Multi-month filtering logic.

---

## 📄 License
This project is open-source and developed for the Code4Campus / Mulearn task.
