import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export function useTransactions() {
  const { state } = useApp();
  const { transactions, filters, sortConfig } = state;

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (filters.type !== "all") result = result.filter((t) => t.type === filters.type);
    if (filters.category !== "all") result = result.filter((t) => t.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.desc.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let av = a[sortConfig.key];
      let bv = b[sortConfig.key];
      if (sortConfig.key === "amount") {
        av = a.type === "income" ? a.amount : -a.amount;
        bv = b.type === "income" ? b.amount : -b.amount;
      }
      if (av < bv) return sortConfig.dir === "asc" ? -1 : 1;
      if (av > bv) return sortConfig.dir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [transactions, filters, sortConfig]);

  return filtered;
}

export function useSummary() {
  const { state } = useApp();
  const { transactions } = state;

  return useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;
    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;
    return { income, expense, balance, savingsRate };
  }, [transactions]);
}

export function useCategoryTotals() {
  const { state } = useApp();
  return useMemo(() => {
    const map = {};
    state.transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [state.transactions]);
}

export function useMonthlyData() {
  const { state } = useApp();
  return useMemo(() => {
    const map = {};
    state.transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
      map[key][t.type] += t.amount;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
  }, [state.transactions]);
}
