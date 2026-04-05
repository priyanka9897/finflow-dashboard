import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import { useSummary, useCategoryTotals, useMonthlyData } from "../hooks/useFinance";
import { fmt, fmtShort, CHART_COLORS } from "../utils/format";
import { useApp } from "../context/AppContext";

export default function Insights() {
  const { state } = useApp();
  const { income, expense, balance, savingsRate } = useSummary();
  const catTotals = useCategoryTotals();
  const monthly = useMonthlyData();

  const topCat = catTotals[0] || ["—", 0];
  const lastTwo = monthly.slice(-2);
  const monthChange =
    lastTwo.length === 2
      ? (((lastTwo[1].expense - lastTwo[0].expense) / lastTwo[0].expense) * 100).toFixed(1)
      : null;

  const avgMonthlyExpense =
    monthly.length > 0
      ? (monthly.reduce((s, m) => s + m.expense, 0) / monthly.length).toFixed(0)
      : 0;

  const incomeCount = state.transactions.filter((t) => t.type === "income").length;
  const expenseCount = state.transactions.filter((t) => t.type === "expense").length;

  return (
    <div className="page">
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-emoji">🏆</div>
          <div className="insight-label">Top Spending Category</div>
          <div className="insight-value">{topCat[0]}</div>
          <div className="insight-sub">{fmt(topCat[1])} spent total</div>
        </div>
        <div className="insight-card">
          <div className="insight-emoji">💰</div>
          <div className="insight-label">Savings Rate</div>
          <div className="insight-value" style={{ color: "var(--green)" }}>
            {savingsRate}%
          </div>
          <div className="insight-sub">Of total income retained</div>
        </div>
        <div className="insight-card">
          <div className="insight-emoji">📅</div>
          <div className="insight-label">Avg Monthly Expense</div>
          <div className="insight-value">{fmt(Number(avgMonthlyExpense))}</div>
          <div className="insight-sub">Across {monthly.length} months</div>
        </div>
        <div className="insight-card">
          <div className="insight-emoji">📊</div>
          <div className="insight-label">Month-over-Month</div>
          <div
            className="insight-value"
            style={{ color: monthChange > 0 ? "var(--red)" : "var(--green)" }}
          >
            {monthChange !== null
              ? `${monthChange > 0 ? "+" : ""}${monthChange}%`
              : "—"}
          </div>
          <div className="insight-sub">Expense change vs prev month</div>
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Spending Breakdown</h3>
        {catTotals.length === 0 ? (
          <div className="empty-state"><p>No expense data yet.</p></div>
        ) : (
          <>
            <div className="bar-list">
              {catTotals.map(([cat, val], i) => {
                const pct = ((val / catTotals[0][1]) * 100).toFixed(0);
                return (
                  <div key={cat} className="bar-row">
                    <div className="bar-meta">
                      <span className="bar-label">{cat}</span>
                      <span className="bar-amount">{fmt(val)}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <ResponsiveContainer width="100%" height={180} style={{ marginTop: 24 }}>
              <BarChart data={catTotals.map(([name, value]) => ({ name, value }))}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text3)" }} />
                <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11, fill: "var(--text3)" }} />
                <Tooltip formatter={(v) => fmt(v)} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {catTotals.map((_, i) => (
                    <Bar key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Income vs Expense — Monthly</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthly} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text3)" }} />
            <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11, fill: "var(--text3)" }} />
            <Tooltip formatter={(v) => fmt(v)} />
            <Line type="monotone" dataKey="income" name="Income" stroke="#22c97a" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="expense" name="Expense" stroke="#f25c5c" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="info-row">
        <div className="info-card">
          <span className="info-label">Total Transactions</span>
          <span className="info-value">{state.transactions.length}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Income entries</span>
          <span className="info-value" style={{ color: "var(--green)" }}>{incomeCount}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Expense entries</span>
          <span className="info-value" style={{ color: "var(--red)" }}>{expenseCount}</span>
        </div>
        <div className="info-card">
          <span className="info-label">Net balance</span>
          <span className="info-value" style={{ color: balance >= 0 ? "var(--green)" : "var(--red)" }}>
            {fmt(balance)}
          </span>
        </div>
      </div>
    </div>
  );
}
