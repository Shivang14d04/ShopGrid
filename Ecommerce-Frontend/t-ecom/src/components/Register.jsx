import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../axios";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import EcommerceIllustration from "./EcommerceIllustration";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((c) => ({ ...c, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      toast.success(res.data.message || "User registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-100 px-3 d-flex flex-column align-items-center justify-content-center position-relative"
      style={{
        backgroundColor: "#FAF7F5",
        minHeight: "100vh",
        paddingTop: "calc(72px + 3rem)",
        paddingBottom: "3rem",
      }}
    >
      {/* ── Main Outer Canvas Container ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-100 position-relative overflow-hidden"
        style={{
          maxWidth: "1060px",
          width: "90%",
          minHeight: "520px",
          borderRadius: "28px",
          backgroundColor: "#FFF8F4",
          border: "1px solid #EFE3DA",
          boxShadow: "0 20px 50px rgba(244, 162, 97, 0.08), 0 8px 24px rgba(45, 41, 38, 0.04)",
          padding: "44px 52px",
        }}
      >
        {/* Soft Ambient Corner Accent */}
        <div
          className="position-absolute"
          style={{
            top: "-60px",
            left: "-60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            backgroundColor: "#FCE9DF",
            opacity: 0.5,
            filter: "blur(45px)",
            pointerEvents: "none",
          }}
        />

        {/* ── Main Canvas Grid Composition ── */}
        <div className="row g-4 align-items-center position-relative" style={{ zIndex: 2 }}>

          {/* Left Column: Title, Tagline, Description & Vector Illustration */}
          <div className="col-lg-6 d-none d-lg-flex flex-column align-items-start justify-content-center pe-lg-4">
            <div className="mb-3 text-start">
              <span
                className="text-uppercase fw-bold d-block mb-2"
                style={{ fontSize: "0.72rem", letterSpacing: "0.08em", color: "#E76F51" }}
              >
                START YOUR JOURNEY
              </span>
              <h2
                className="fw-extrabold mb-2"
                style={{ color: "#292524", letterSpacing: "-0.5px", fontSize: "1.75rem", lineHeight: "1.25" }}
              >
                Start Your Shopping Journey Today.
              </h2>
              <p className="mb-0" style={{ color: "#78716C", fontSize: "0.9rem", lineHeight: "1.5", maxWidth: "370px" }}>
                Join ShopGrid to save cart items, receive exclusive member discounts, manage invoices, and checkout securely.
              </p>
            </div>

            {/* Flat Vector SVG Illustration */}
            <div className="w-100 d-flex justify-content-start mt-3">
              <EcommerceIllustration style={{ maxWidth: "340px", maxHeight: "250px", filter: "drop-shadow(0 8px 20px rgba(45, 41, 38, 0.04))" }} />
            </div>
          </div>

          {/* Right Column: Clean White Authentication Form Card */}
          <div className="col-lg-6 d-flex justify-content-center justify-content-lg-end">
            <div
              className="w-100 p-4 p-sm-5"
              style={{
                maxWidth: "410px",
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                border: "1px solid #EFE3DA",
                boxShadow: "0 10px 30px rgba(45, 41, 38, 0.03)",
              }}
            >
              {/* Form Title */}
              <div className="text-start mb-4">
                <h3 className="fw-bold mb-1" style={{ color: "#292524", fontSize: "1.4rem", letterSpacing: "-0.3px" }}>
                  Create Your Account
                </h3>
                <p style={{ color: "#78716C", fontSize: "0.85rem" }}>Join ShopGrid and start shopping today.</p>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="position-relative">
                  <span className="position-absolute start-0 top-50 translate-middle-y ms-3" style={{ color: "#9C8E86" }}>
                    <FiUser size={17} />
                  </span>
                  <input
                    className="form-control ps-5 auth-input-field"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    style={{ height: "48px", borderRadius: "12px", fontSize: "0.9rem" }}
                  />
                </div>

                <div className="position-relative">
                  <span className="position-absolute start-0 top-50 translate-middle-y ms-3" style={{ color: "#9C8E86" }}>
                    <FiMail size={17} />
                  </span>
                  <input
                    className="form-control ps-5 auth-input-field"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    style={{ height: "48px", borderRadius: "12px", fontSize: "0.9rem" }}
                  />
                </div>

                <div className="position-relative">
                  <span className="position-absolute start-0 top-50 translate-middle-y ms-3" style={{ color: "#9C8E86" }}>
                    <FiLock size={17} />
                  </span>
                  <input
                    className="form-control ps-5 pe-5 auth-input-field"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    style={{ height: "48px", borderRadius: "12px", fontSize: "0.9rem" }}
                  />
                  <button
                    type="button"
                    className="position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent p-0 shadow-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    style={{ color: "#9C8E86" }}
                  >
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>

                <button
                  className="btn w-100 mt-2 d-flex align-items-center justify-content-center gap-2 border-0"
                  disabled={loading}
                  type="submit"
                  style={{
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "#E76F51",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    boxShadow: "0 4px 14px rgba(231, 111, 81, 0.3)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d15d41")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E76F51")}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account <FiArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-1" style={{ fontSize: "0.86rem", color: "#78716C" }}>
                Already have an account?{" "}
                <Link to="/login" className="fw-bold text-decoration-none" style={{ color: "#E76F51" }}>
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer copyright line */}
      <div className="text-center mt-4" style={{ fontSize: "0.8rem", color: "#9C8E86" }}>
        © 2026 ShopGrid. All rights reserved.
      </div>
    </div>
  );
};

export default Register;
