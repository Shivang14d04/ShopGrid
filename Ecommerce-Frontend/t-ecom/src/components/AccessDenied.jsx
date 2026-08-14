import React from "react";
import { Link } from "react-router-dom";
import { FiShield, FiHome, FiLogIn } from "react-icons/fi";

const AccessDenied = () => {
  return (
    <div className="main-layout d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="text-center p-5" style={{ maxWidth: "440px", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-md)" }}>
        <div className="d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "72px", height: "72px", borderRadius: "var(--radius-md)", background: "var(--danger-light)" }}>
          <FiShield size={32} style={{ color: "var(--danger-color)" }} />
        </div>
        <h1 className="fw-bold mb-1" style={{ fontSize: "3rem", color: "var(--danger-color)" }}>403</h1>
        <h4 className="fw-bold mb-2">Access Denied</h4>
        <p className="mb-4" style={{ color: "var(--text-muted)" }}>You do not have permission to access this page.</p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/" className="btn btn-primary d-flex align-items-center gap-2"><FiHome size={16} /> Go Home</Link>
          <Link to="/login" className="btn btn-outline-primary d-flex align-items-center gap-2"><FiLogIn size={16} /> Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
