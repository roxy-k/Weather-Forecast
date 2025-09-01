import React from "react";

export default function ErrorBanner({ message, children }) {
  const text = message ?? children;
  if (!text) return null;
  return (
    <div className="error-banner" role="alert" aria-live="polite">
      {text}
    </div>
  );
}


