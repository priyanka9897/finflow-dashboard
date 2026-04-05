import React from "react";

export default function SummaryCard({ label, value, sub, accent }) {
  return (
    <div className="summary-card">
      <div className="card-label">{label}</div>
      <div className="card-value" style={accent ? { color: accent } : {}}>
        {value}
      </div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
  );
}
