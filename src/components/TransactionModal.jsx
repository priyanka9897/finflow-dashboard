import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/transactions";
import { today } from "../utils/format";

const EMPTY = {
  desc: "", amount: "", type: "expense", category: "Food", date: today(),
};

export default function TransactionModal({ editData, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm({ ...editData, amount: String(editData.amount) });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [editData]);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.desc.trim()) e.desc = "Description is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const payload = { ...form, amount: parseFloat(form.amount) };
    if (editData) {
      dispatch({ type: "EDIT_TRANSACTION", payload: { ...payload, id: editData.id } });
    } else {
      dispatch({ type: "ADD_TRANSACTION", payload });
    }
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editData ? "Edit Transaction" : "Add Transaction"}</h2>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="form-row">
          <label className="form-label">Description</label>
          <input
            className={`form-input ${errors.desc ? "error" : ""}`}
            placeholder="e.g. Monthly Salary"
            value={form.desc}
            onChange={(e) => set("desc", e.target.value)}
          />
          {errors.desc && <span className="form-error">{errors.desc}</span>}
        </div>

        <div className="form-row">
          <label className="form-label">Amount ($)</label>
          <input
            className={`form-input ${errors.amount ? "error" : ""}`}
            type="number"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
          />
          {errors.amount && <span className="form-error">{errors.amount}</span>}
        </div>

        <div className="form-row two-col">
          <div>
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Date</label>
          <input
            className={`form-input ${errors.date ? "error" : ""}`}
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {editData ? "Update" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
