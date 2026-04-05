import React from "react";
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  Sun, Moon, ChevronDown,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV = [
  { id: "dashboard",    label: "Dashboard",     Icon: LayoutDashboard },
  { id: "transactions", label: "Transactions",  Icon: ArrowLeftRight   },
  { id: "insights",     label: "Insights",      Icon: Lightbulb        },
];

export default function Sidebar({ activePage, setActivePage }) {
  const { state, dispatch } = useApp();

  return (
    <aside className="sidebar">
      <div className="logo">$<span>Tracker</span></div>

      <nav className="nav-list">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item ${activePage === id ? "active" : ""}`}
            onClick={() => setActivePage(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="role-box">
          <label className="role-label">Role</label>
          <div className="select-wrap">
            <select
              className="role-select"
              value={state.role}
              onChange={(e) => dispatch({ type: "SET_ROLE", payload: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <ChevronDown size={13} className="select-icon" />
          </div>
          <p className="role-hint">
            {state.role === "admin"
              ? "Can add, edit & delete"
              : "Read-only access"}
          </p>
        </div>

        <button
          className="theme-btn"
          onClick={() =>
            dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" })
          }
        >
          {state.theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          <span>{state.theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </aside>
  );
}
