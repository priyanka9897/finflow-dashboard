import React, { useState } from "react";
import { Search, Plus, ArrowUpDown, Trash2, Pencil, Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTransactions } from "../hooks/useFinance";
import { CATEGORIES } from "../data/transactions";
import { fmt } from "../utils/format";
import TransactionModal from "../components/TransactionModal";

function exportCSV(transactions) {
  const header = "Date,Description,Category,Type,Amount";
  const rows = transactions.map(
    (t) => `${t.date},"${t.desc}",${t.category},${t.type},${t.type === "income" ? "" : "-"}${t.amount}`
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "finflow-transactions.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function Transactions() {
  const { state, dispatch } = useApp();
  const filtered = useTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const isAdmin = state.role === "admin";

  function openAdd() { setEditData(null); setModalOpen(true); }
  function openEdit(t) { setEditData(t); setModalOpen(true); }
  function confirmDelete(id) { setDeleteId(id); }
  function doDelete() {
    dispatch({ type: "DELETE_TRANSACTION", payload: deleteId });
    setDeleteId(null);
  }

  const sortArrow = (col) => {
    if (state.sortConfig.key !== col) return null;
    return state.sortConfig.dir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="page">
      <div className="section-header">
        <div className="controls-left">
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search transactions..."
              value={state.filters.search}
              onChange={(e) =>
                dispatch({ type: "SET_FILTER", payload: { search: e.target.value } })
              }
            />
          </div>
          <select
            className="filter-select"
            value={state.filters.type}
            onChange={(e) =>
              dispatch({ type: "SET_FILTER", payload: { type: e.target.value } })
            }
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="filter-select"
            value={state.filters.category}
            onChange={(e) =>
              dispatch({ type: "SET_FILTER", payload: { category: e.target.value } })
            }
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          {(state.filters.type !== "all" ||
            state.filters.category !== "all" ||
            state.filters.search) && (
            <button
              className="btn btn-ghost"
              onClick={() => dispatch({ type: "RESET_FILTERS" })}
            >
              Clear
            </button>
          )}
        </div>
        <div className="controls-right">
          <button className="btn btn-ghost" onClick={() => exportCSV(filtered)}>
            <Download size={14} /> Export CSV
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={14} /> Add
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found.</p>
            <span>Try adjusting your filters.</span>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                {[
                  { key: "date",     label: "Date"        },
                  { key: "desc",     label: "Description" },
                  { key: "category", label: "Category"    },
                  { key: "type",     label: "Type"        },
                  { key: "amount",   label: "Amount"      },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => dispatch({ type: "SET_SORT", payload: key })}
                    className={key === "amount" ? "text-right" : ""}
                  >
                    {label}
                    <ArrowUpDown size={11} style={{ marginLeft: 4, opacity: 0.4 }} />
                    {sortArrow(key)}
                  </th>
                ))}
                {isAdmin && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="muted">{t.date}</td>
                  <td className="bold">{t.desc}</td>
                  <td><span className="cat-pill">{t.category}</span></td>
                  <td>
                    <span className={`type-badge ${t.type}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`text-right amount ${t.type}`}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </td>
                  {isAdmin && (
                    <td className="text-right">
                      <button className="icon-btn" onClick={() => openEdit(t)}>
                        <Pencil size={14} />
                      </button>
                      <button className="icon-btn danger" onClick={() => confirmDelete(t.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="table-footer">
        Showing {filtered.length} of {state.transactions.length} transactions
      </div>

      {modalOpen && (
        <TransactionModal
          editData={editData}
          onClose={() => setModalOpen(false)}
        />
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Delete Transaction?</h2>
            <p style={{ color: "var(--text2)", marginBottom: 20, fontSize: 14 }}>
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
