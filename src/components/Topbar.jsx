import React from "react";
import { useApp } from "../context/AppContext";

const PAGE_TITLES = {
  dashboard:    "Overview",
  transactions: "Transactions",
  insights:     "Insights",
};

export default function Topbar({ activePage }) {
  const { state } = useApp();

  return (
    <header className="topbar">
      <h1 className="topbar-title">{PAGE_TITLES[activePage]}</h1>
      <div className="topbar-right">
        <span className={`role-badge ${state.role}`}>
          {state.role === "admin" ? "Admin" : "Viewer"}
        </span>
        <div className="avatar">
          {state.role === "admin" ? "A" : "V"}
        </div>
      </div>
    </header>
  );
}
