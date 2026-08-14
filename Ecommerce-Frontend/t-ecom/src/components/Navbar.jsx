import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";
import { FiShoppingCart, FiUser, FiSearch, FiLogOut, FiSliders, FiMenu, FiX, FiPlusCircle } from "react-icons/fi";

const Navbar = ({ onSelectCategory }) => {
  const { isAuthenticated, currentUser, logout, cart } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavbarToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleLinkClick = () => {
    setIsNavCollapsed(true);
    setProfileDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    setIsLoading(true);
    setIsNavCollapsed(true);

    try {
      const response = await axios.get(`/products/search?keyword=${input}`);
      navigate(`/search-results`, { state: { searchData: response.data } });
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      ref={navbarRef}
      className="fixed-top"
      style={{
        zIndex: 1030,
        height: "72px",
        background: scrolled ? "rgba(255, 249, 243, 0.96)" : "rgba(255, 249, 243, 0.90)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-color)",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        transition: "background-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div
        className="h-100 mx-auto px-3 px-md-4 d-flex align-items-center justify-content-between gap-2 gap-lg-4"
        style={{ maxWidth: "1280px" }}
      >
        {/* ── 1. Logo & Desktop Navigation Group ── */}
        <div className="d-flex align-items-center gap-3 gap-xl-4 flex-shrink-0">
          {/* Logo */}
          <Link
            className="d-flex align-items-center gap-2 text-decoration-none"
            to="/"
            onClick={handleLinkClick}
          >
            <span
              className="d-inline-flex align-items-center justify-content-center fw-bold shadow-xs"
              style={{
                width: "38px",
                height: "38px",
                fontSize: "0.95rem",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                borderRadius: "var(--radius-sm)",
                letterSpacing: "-0.02em",
                flexShrink: 0,
              }}
            >
              S
            </span>
            <span
              style={{
                fontWeight: "800",
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                fontSize: "1.2rem",
                fontFamily: "'Outfit', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              ShopGrid
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="nav-link-custom"
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                fontWeight: isActive("/") ? 700 : 600,
                color: isActive("/") ? "var(--primary)" : "var(--text-secondary)",
                backgroundColor: isActive("/") ? "var(--primary-light)" : "transparent",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              Shop
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                onClick={handleLinkClick}
                className="nav-link-custom"
                style={{
                  padding: "0.45rem 0.85rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  fontWeight: isActive("/orders") ? 700 : 600,
                  color: isActive("/orders") ? "var(--primary)" : "var(--text-secondary)",
                  backgroundColor: isActive("/orders") ? "var(--primary-light)" : "transparent",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {currentUser?.role === "ROLE_ADMIN" ? "All Orders" : "My Orders"}
              </Link>
            )}

            {isAuthenticated && currentUser?.role === "ROLE_ADMIN" && (
              <>
                <Link
                  to="/admin"
                  onClick={handleLinkClick}
                  className="nav-link-custom"
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9rem",
                    fontWeight: isActive("/admin") ? 700 : 600,
                    color: isActive("/admin") ? "var(--primary)" : "var(--text-secondary)",
                    backgroundColor: isActive("/admin") ? "var(--primary-light)" : "transparent",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/add_product"
                  onClick={handleLinkClick}
                  className="nav-link-custom"
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9rem",
                    fontWeight: isActive("/add_product") ? 700 : 600,
                    color: isActive("/add_product") ? "var(--primary)" : "var(--text-secondary)",
                    backgroundColor: isActive("/add_product") ? "var(--primary-light)" : "transparent",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  Add Product
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ── 2. Central Search Bar (Desktop & Tablet) ── */}
        <form
          className="d-none d-md-block flex-grow-1 position-relative"
          onSubmit={handleSubmit}
          style={{ maxWidth: "420px", minWidth: "220px" }}
        >
          <div
            className="d-flex align-items-center px-3 py-2"
            style={{
              borderRadius: "var(--radius-full)",
              border: "1.5px solid var(--border-color)",
              backgroundColor: "var(--bg-card)",
              gap: "0.5rem",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(231, 111, 81, 0.10)";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FiSearch size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                width: "100%",
                fontSize: "0.88rem",
                color: "var(--text-primary)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </div>
          {isLoading && (
            <div className="position-absolute end-0 top-50 translate-middle-y me-3">
              <span className="spinner-border spinner-border-sm" role="status" style={{ color: "var(--primary)", width: "0.9rem", height: "0.9rem" }}></span>
            </div>
          )}
        </form>

        {/* ── 3. Right-Side Actions (Cart & Profile/Auth) ── */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          {/* Cart Icon Button */}
          <Link
            to="/cart"
            className="btn p-0 position-relative d-flex align-items-center justify-content-center"
            onClick={handleLinkClick}
            aria-label="Shopping Cart"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-card)",
              border: "1.5px solid var(--border-color)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
          >
            <FiShoppingCart size={18} />
            {cartItemCount > 0 && (
              <span
                className="position-absolute d-flex align-items-center justify-content-center fw-bold"
                style={{
                  fontSize: "0.65rem",
                  minWidth: "18px",
                  height: "18px",
                  padding: "0 4px",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "var(--radius-full)",
                  border: "2px solid var(--bg-primary)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Profile / Auth Dropdown */}
          {isAuthenticated ? (
            <div className="position-relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="btn p-0 d-flex align-items-center gap-2 border-0 shadow-none"
                aria-expanded={profileDropdownOpen}
                aria-label="User Profile Menu"
              >
                <div
                  className="d-flex align-items-center justify-content-center fw-bold text-uppercase"
                  style={{
                    width: "40px",
                    height: "40px",
                    fontSize: "0.85rem",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    borderRadius: "var(--radius-sm)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {currentUser?.username?.slice(0, 2) || "U"}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className="position-absolute end-0 mt-2 py-2"
                  style={{
                    width: "230px",
                    zIndex: 1050,
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    boxShadow: "var(--shadow-lg)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div className="px-3 py-2 border-bottom" style={{ borderColor: "var(--border-color)" }}>
                    <div className="fw-bold text-truncate" style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                      {currentUser?.username}
                    </div>
                    <span
                      className="mt-1 d-inline-block"
                      style={{
                        fontSize: "0.68rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--primary-light)",
                        color: "var(--primary)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {currentUser?.role?.replace("ROLE_", "")}
                    </span>
                  </div>

                  <div className="pt-1">
                    <Link
                      to="/orders"
                      className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                      onClick={handleLinkClick}
                      style={{ color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: 500 }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-lighter)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <FiUser size={15} /> {currentUser?.role === "ROLE_ADMIN" ? "Manage Orders" : "My Orders"}
                    </Link>

                    {currentUser?.role === "ROLE_ADMIN" && (
                      <>
                        <Link
                          to="/admin"
                          className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                          onClick={handleLinkClick}
                          style={{ color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: 500 }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-lighter)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <FiSliders size={15} /> Admin Dashboard
                        </Link>
                        <Link
                          to="/add_product"
                          className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                          onClick={handleLinkClick}
                          style={{ color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: 500 }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-lighter)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <FiPlusCircle size={15} /> Add Product
                        </Link>
                      </>
                    )}

                    <div className="border-top my-1" style={{ borderColor: "var(--border-color)" }}></div>

                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                        handleLinkClick();
                      }}
                      className="d-flex align-items-center gap-2 px-3 py-2 border-0 w-100 bg-transparent text-start"
                      style={{ color: "var(--danger-color)", fontSize: "0.88rem", fontWeight: 500, cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--danger-light)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/login"
                className="btn btn-sm px-3 py-2 text-decoration-none"
                onClick={handleLinkClick}
                style={{
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  backgroundColor: "var(--bg-card)",
                  whiteSpace: "nowrap",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm px-3 py-2 d-none d-sm-inline-flex text-decoration-none"
                onClick={handleLinkClick}
                style={{ fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap" }}
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="btn p-2 d-lg-none border-0 shadow-none d-flex align-items-center justify-content-center"
            type="button"
            onClick={handleNavbarToggle}
            aria-label="Toggle navigation"
            style={{
              width: "40px",
              height: "40px",
              color: "var(--text-primary)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--bg-card)",
              border: "1.5px solid var(--border-color)",
            }}
          >
            {isNavCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
        </div>
      </div>

      {/* ── 4. Mobile Drawer / Expanded Menu ── */}
      {!isNavCollapsed && (
        <div
          className="d-lg-none border-top px-3 py-3 shadow-md"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Mobile Search Bar */}
          <form className="mb-3 position-relative" onSubmit={handleSubmit}>
            <div
              className="d-flex align-items-center px-3 py-2"
              style={{
                borderRadius: "var(--radius-full)",
                border: "1.5px solid var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
                gap: "0.5rem",
              }}
            >
              <FiSearch size={16} style={{ color: "var(--text-muted)" }} />
              <input
                type="search"
                placeholder="Search products..."
                aria-label="Search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  fontSize: "0.88rem",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </form>

          {/* Mobile Links */}
          <div className="d-flex flex-column gap-1">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="px-3 py-2 text-decoration-none fw-semibold"
              style={{
                borderRadius: "var(--radius-sm)",
                fontSize: "0.92rem",
                color: isActive("/") ? "var(--primary)" : "var(--text-primary)",
                backgroundColor: isActive("/") ? "var(--primary-light)" : "transparent",
                whiteSpace: "nowrap",
              }}
            >
              Shop
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                onClick={handleLinkClick}
                className="px-3 py-2 text-decoration-none fw-semibold"
                style={{
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.92rem",
                  color: isActive("/orders") ? "var(--primary)" : "var(--text-primary)",
                  backgroundColor: isActive("/orders") ? "var(--primary-light)" : "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {currentUser?.role === "ROLE_ADMIN" ? "All Orders" : "My Orders"}
              </Link>
            )}

            {isAuthenticated && currentUser?.role === "ROLE_ADMIN" && (
              <>
                <Link
                  to="/admin"
                  onClick={handleLinkClick}
                  className="px-3 py-2 text-decoration-none fw-semibold"
                  style={{
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.92rem",
                    color: isActive("/admin") ? "var(--primary)" : "var(--text-primary)",
                    backgroundColor: isActive("/admin") ? "var(--primary-light)" : "transparent",
                    whiteSpace: "nowrap",
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/add_product"
                  onClick={handleLinkClick}
                  className="px-3 py-2 text-decoration-none fw-semibold"
                  style={{
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.92rem",
                    color: isActive("/add_product") ? "var(--primary)" : "var(--text-primary)",
                    backgroundColor: isActive("/add_product") ? "var(--primary-light)" : "transparent",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add Product
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <div className="d-flex gap-2 mt-2 pt-2 border-top" style={{ borderColor: "var(--border-color)" }}>
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="btn btn-outline-primary w-50 py-2"
                  style={{ fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="btn btn-primary w-50 py-2"
                  style={{ fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;