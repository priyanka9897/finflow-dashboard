# FinFlow — Finance Dashboard

A clean, interactive personal finance dashboard built with React. Designed for the Frontend Intern Assignment.


---

## Features

### Dashboard Overview
- **Summary cards** — Total Balance, Income, Expenses, and Savings Rate
- **Monthly Cash Flow** bar chart (income vs expense per month)
- **Spending by Category** donut chart
- **Balance Trend** line chart over time

### Transactions
- Full transaction table with Date, Description, Category, Type, Amount
- **Live search** — filter by description or category as you type
- **Dropdown filters** — by type (income/expense) and category
- **Column sorting** — click any header to sort ascending/descending
- **Add / Edit / Delete** (Admin only)
- **Export to CSV** — one-click download of filtered transactions

### Role-Based UI
| Feature | Admin | Viewer |
|---|---|---|
| View all data | ✅ | ✅ |
| Add transactions | ✅ | ❌ |
| Edit transactions | ✅ | ❌ |
| Delete transactions | ✅ | ❌ |
| Export CSV | ✅ | ✅ |

Switch roles via the sidebar dropdown — no backend required.

### Insights
- Top spending category
- Savings rate calculation
- Month-over-month expense change
- Average monthly expense
- Horizontal bar breakdown by category
- Income vs Expense line chart comparison

### Extras
- **Dark / Light mode** toggle
- **localStorage persistence** — data survives page refresh
- **Responsive** — works on mobile, tablet, and desktop
- **Form validation** — required fields, amount must be positive
- **Delete confirmation** modal
- **Empty states** — graceful UI when no data matches filters

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| React Context + useReducer | Global state management |
| Recharts | Charts (bar, line, pie/donut) |
| Lucide React | Icons |
| CSS (custom properties) | Theming & styling |
| localStorage | Data persistence |

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation + role switcher + theme toggle
│   ├── Topbar.jsx           # Page header with role badge
│   ├── SummaryCard.jsx      # Reusable metric card
│   └── TransactionModal.jsx # Add/Edit form with validation
├── context/
│   └── AppContext.jsx       # Global state (useReducer + Context)
├── data/
│   └── transactions.js      # Mock data + categories list
├── hooks/
│   └── useFinance.js        # Derived data hooks (filtered, summary, monthly)
├── pages/
│   ├── Dashboard.jsx        # Overview with charts
│   ├── Transactions.jsx     # Full transaction table
│   └── Insights.jsx         # Analytics & observations
├── styles/
│   └── index.css            # All styles with CSS variables
├── utils/
│   └── format.js            # Currency formatting, color palette
├── App.jsx                  # Root layout + page routing
└── index.js                 # React entry point
```

---

## State Management

All global state lives in `AppContext` using React's `useReducer`:

```js
{
  transactions: [...],     // Array of all transactions
  role: "admin",           // "admin" | "viewer"
  filters: {               // Active filters for transaction table
    type: "all",
    category: "all",
    search: ""
  },
  sortConfig: {            // Sort column + direction
    key: "date",
    dir: "desc"
  },
  theme: "dark",           // "dark" | "light"
  nextId: 31               // Auto-incrementing ID counter
}
```

State is persisted to `localStorage` on every change via a `useEffect`.

Derived data (filtered list, totals, monthly breakdown) is computed by custom hooks in `useFinance.js` using `useMemo` for performance.

---

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/finflow-dashboard.git
cd finflow-dashboard

# Install dependencies
npm install

# Start the development server
npm start
```

The app opens at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Output goes to the `/build` folder — ready to deploy to Vercel, Netlify, or any static host.

---

## Design Decisions

**No external routing library** — with only 3 pages, simple `useState` for the active page keeps the bundle small and the logic clear.

**CSS custom properties over Tailwind** — allows clean dark/light theming with a single `data-theme` attribute on `<html>`, and keeps styles co-located without build tooling complexity.

**Recharts over Chart.js** — native React components that re-render cleanly with state changes, no imperative `chart.destroy()` lifecycle management needed.

**useReducer over Redux** — the state shape is flat and simple; a reducer gives structure without the boilerplate overhead of a full Redux setup.

---

## Assumptions Made

- Role switching is frontend-only (no auth/backend) — appropriate for a demo
- "Basic RBAC" means showing/hiding UI elements based on role, not route guards
- Mock data covers 3 months to give meaningful chart visualizations
- CSV export uses the currently filtered/visible transactions

---

## Author

Built for the Frontend Internship Assignment — April 2026
