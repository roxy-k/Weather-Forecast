import React from "react";

export default function Spinner({ label = "Loading…" }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      <span className="spinner-text">{label}</span>
    </div>
  );
}
