import React from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import SummaryCard from "../components/SummaryCard";
import { useSummary, useCategoryTotals, useMonthlyData } from "../hooks/useFinance";
import { fmt, fmtShort, CHART_COLORS } from "../utils/format";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { income, expense, balance, savingsRate } = useSummary();
  const catTotals = useCategoryTotals();
  const monthly = useMonthlyData();

  return (
    <div className="page">
      <div className="cards-grid">
        <SummaryCard
          label="Total Balance"
          value={fmt(balance)}
          sub="Net all-time"
          accent={balance >= 0 ? "var(--green)" : "var(--red)"}
        />
        <SummaryCard
          label="Total Income"
          value={fmt(income)}
          sub="All inflows"
          accent="var(--green)"
        />
        <SummaryCard
          label="Total Expenses"
          value={fmt(expense)}
          sub="All outflows"
          accent="var(--red)"
        />
        <SummaryCard
          label="Savings Rate"
          value={`${savingsRate}%`}
          sub="Of income retained"
        />
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3 className="chart-title">Monthly Cash Flow</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text3)" }} />
              <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11, fill: "var(--text3)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#22c97a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#f25c5c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={catTotals.map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {catTotals.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend
                iconType="square"
                iconSize={9}
                formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: 0 }}>
        <h3 className="chart-title">Balance Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={monthly.map((m) => ({ ...m, net: m.income - m.expense }))}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text3)" }} />
            <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11, fill: "var(--text3)" }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="net"
              name="Net"
              stroke="#4f8ef7"
              strokeWidth={2}
              dot={{ r: 4, fill: "#4f8ef7" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
