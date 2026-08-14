import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../axios";
import AppContext from "../Context/Context";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import EcommerceIllustration from "./EcommerceIllustration";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loginMode, setLoginMode] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AppContext);

  React.useEffect(() => {
    const requestedMode = searchParams.get("role");
    if (requestedMode === "admin") {
      setLoginMode("ADMIN");
      setForm({ username: "admin", password: "" });
      return;
    }
    setLoginMode("USER");
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const selectLoginMode = (mode) => {
    setLoginMode(mode);
    setForm((current) => ({
      ...current,
      username: mode === "ADMIN" ? "admin" : current.username === "admin" ? "" : current.username,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/auth/login", form);
      login(response.data.token);
      toast.success("Logged in successfully");
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials");
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
                NEXT-GEN SHOPPING
              </span>
              <h2
                className="fw-extrabold mb-2"
                style={{ color: "#292524", letterSpacing: "-0.5px", fontSize: "1.75rem", lineHeight: "1.25" }}
              >
                The Next Generation E-commerce Hub.
              </h2>
              <p className="mb-0" style={{ color: "#78716C", fontSize: "0.9rem", lineHeight: "1.5", maxWidth: "370px" }}>
                Log in to access your dashboard, track current orders, manage inventories, and checkout using instant secured gateways.
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
              <div className="text-start mb-3">
                <h3 className="fw-bold mb-1" style={{ color: "#292524", fontSize: "1.4rem", letterSpacing: "-0.3px" }}>
                  Welcome Back
                </h3>
                <p style={{ color: "#78716C", fontSize: "0.85rem" }}>Sign in to continue shopping with ShopGrid.</p>
              </div>

              {/* Customer / Admin Mode Selector */}
              <div
                className="d-flex p-1 mb-3"
                style={{ backgroundColor: "var(--bg-secondary)", borderRadius: "10px" }}
              >
                <button
                  type="button"
                  className="btn btn-sm flex-grow-1 border-0 py-1.5 fw-bold"
                  onClick={() => selectLoginMode("USER")}
                  style={{
                    borderRadius: "8px",
                    background: loginMode === "USER" ? "var(--primary)" : "transparent",
                    color: loginMode === "USER" ? "#FFFFFF" : "#78716C",
                    fontSize: "0.84rem",
                    transition: "all 0.2s ease"
                  }}
                >
                  Customer
                </button>
                <button
                  type="button"
                  className="btn btn-sm flex-grow-1 border-0 py-1.5 fw-bold"
                  onClick={() => selectLoginMode("ADMIN")}
                  style={{
                    borderRadius: "8px",
                    background: loginMode === "ADMIN" ? "var(--primary)" : "transparent",
                    color: loginMode === "ADMIN" ? "#FFFFFF" : "#78716C",
                    fontSize: "0.84rem",
                    transition: "all 0.2s ease"
                  }}
                >
                  Admin Portal
                </button>
              </div>

              {loginMode === "ADMIN" && (
                <div
                  className="py-1.5 px-3 mb-3 text-center"
                  style={{
                    borderRadius: "8px",
                    background: "var(--info-light)",
                    color: "var(--info-color)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Autofilled Administrator credentials.
                </div>
              )}

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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <FiArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-1" style={{ fontSize: "0.86rem", color: "#78716C" }}>
                New to ShopGrid?{" "}
                <Link to="/register" className="fw-bold text-decoration-none" style={{ color: "#E76F51" }}>
                  Create an account
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

export default Login;
