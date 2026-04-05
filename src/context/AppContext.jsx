import React, { createContext, useContext, useReducer, useEffect } from "react";
import { initialTransactions } from "../data/transactions";

const AppContext = createContext(null);

const STORAGE_KEY = "finflow_data";

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

const defaultState = {
  transactions: initialTransactions,
  role: "admin",
  filters: { type: "all", category: "all", search: "" },
  sortConfig: { key: "date", dir: "desc" },
  theme: "dark",
  nextId: 31,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_SORT":
      return {
        ...state,
        sortConfig: {
          key: action.payload,
          dir:
            state.sortConfig.key === action.payload && state.sortConfig.dir === "asc"
              ? "desc"
              : "asc",
        },
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, { ...action.payload, id: state.nextId }],
        nextId: state.nextId + 1,
      };
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "RESET_FILTERS":
      return { ...state, filters: defaultState.filters };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const saved = loadState();
  const [state, dispatch] = useReducer(reducer, saved || defaultState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
