import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import { FiFilter, FiShoppingCart, FiEye, FiX, FiCheck } from "react-icons/fi";

const Home = ({ selectedCategory: navbarCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);
  const navigate = useNavigate();
  // Filtering & Sorting states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState(100000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  const [sortBy, setSortBy] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync category selected from Navbar
  useEffect(() => {
    if (navbarCategory !== undefined) {
      setCategoryFilter(navbarCategory);
    }
  }, [navbarCategory]);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  // Determine dynamic maximum price from fetched products
  useEffect(() => {
    if (data && data.length > 0) {
      const prices = data.map(p => p.price);
      const maxPrice = Math.max(...prices);
      setMaxPriceLimit(maxPrice);
      setPriceRange(maxPrice);
    }
  }, [data]);

  useEffect(() => {
    let toastTimer;
    if (showToast) {
      toastTimer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [showToast]);

  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return unplugged;
    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  const handleClearFilters = () => {
    setCategoryFilter("");
    setPriceRange(maxPriceLimit);
    setSortBy("default");
  };

  const categories = [
    { name: "Laptop", icon: "💻" },
    { name: "Headphone", icon: "🎧" },
    { name: "Mobile", icon: "📱" },
    { name: "Electronics", icon: "⚡" },
    { name: "Toys", icon: "🧸" },
    { name: "Fashion", icon: "👗" },
  ];

  // Apply filters
  const filteredProducts = data.filter((product) => {
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesPrice = product.price <= priceRange;
    return matchesCategory && matchesPrice;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    } else if (sortBy === "newest") {
      return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
    } else if (sortBy === "popularity") {
      // Simulate popularity by high stock count
      return b.stockQuantity - a.stockQuantity;
    }
    return 0; // default
  });

  if (isError) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="text-center p-5" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-md)" }}>
          <img src={unplugged} alt="Error" className="img-fluid mb-4" width="80" />
          <h4 className="fw-bold mb-2">Network Connection Issue</h4>
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>Unable to fetch products. Please ensure the backend server is running.</p>
          <button className="btn btn-primary" onClick={() => refreshData()}>Retry Connection</button>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="main-layout" style={{ minHeight: "100vh" }}>
      {/* Toast Notification */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1060 }}>
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="d-flex align-items-center gap-3 p-3"
              style={{
                width: "360px",
                backgroundColor: "var(--bg-card)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-xl)",
              }}
              role="alert"
            >
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--success-light)",
                  color: "var(--success-color)",
                }}
              >
                <FiCheck size={18} />
              </div>
              {toastProduct && (
                <div className="flex-grow-1 min-width-0">
                  <div className="fw-bold text-truncate" style={{ fontSize: "0.88rem" }}>{toastProduct.name}</div>
                  <small style={{ color: "var(--text-muted)" }}>Added to cart · ₹{toastProduct.price.toLocaleString("en-IN")}</small>
                </div>
              )}
              <button
                type="button"
                className="btn-close shadow-none"
                onClick={() => setShowToast(false)}
                style={{ fontSize: "0.6rem" }}
              ></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero Banner Section */}
      <div className="container px-4 mb-5 mt-4">
        <div
          className="p-5 d-flex flex-column justify-content-center position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FFF5EB 0%, #FFE8D6 40%, rgba(231, 111, 81, 0.08) 100%)",
            minHeight: "300px",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-color)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="position-absolute"
            style={{
              right: "-60px",
              top: "-60px",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(231, 111, 81, 0.12) 0%, rgba(244, 162, 97, 0.08) 100%)",
            }}
          ></div>
          <div
            className="position-absolute"
            style={{
              right: "80px",
              bottom: "-40px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(244, 162, 97, 0.10)",
            }}
          ></div>
          <div
            className="position-absolute"
            style={{
              left: "40%",
              top: "20px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(106, 153, 78, 0.06)",
            }}
          ></div>

          <div className="row position-relative" style={{ zIndex: 1 }}>
            <div className="col-md-7 d-flex flex-column justify-content-center">
              <span
                className="align-self-start mb-3 px-3 py-2 fw-bold text-uppercase d-inline-flex align-items-center gap-2"
                style={{
                  fontSize: "0.72rem",
                  borderRadius: "var(--radius-full)",
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                  color: "#fff",
                  letterSpacing: "0.06em",
                }}
              >
                🔥 Summer Sale Live
              </span>
              <h1 className="display-5 fw-bold mb-2" style={{ letterSpacing: "-1.5px", lineHeight: "1.1" }}>
                Next-Gen Tech <br />
                <span style={{ background: "linear-gradient(135deg, #E76F51 0%, #F4A261 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Devices
                </span>
              </h1>
              <p className="mb-4" style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "480px", lineHeight: "1.6" }}>
                Upgrade your desktop space. Get up to 40% discount on Laptops, Headphones, and Electronics.
              </p>
              <div>
                <a
                  href="#products-section"
                  className="btn btn-primary btn-lg px-4 shadow-none"
                  style={{ borderRadius: "var(--radius-sm)", fontWeight: 700 }}
                >
                  Shop Catalog →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products & Filters Container */}
      <div className="container px-4" id="products-section">
        <div className="row">

          {/* Filters Sidebar (Desktop) */}
          <div className="col-lg-3 d-none d-lg-block">
            <div
              className="p-4 sticky-top"
              style={{
                top: "100px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                  <FiFilter size={16} /> Filters
                </h6>
                <button
                  className="btn btn-link text-decoration-none p-0 border-0"
                  onClick={handleClearFilters}
                  style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.82rem" }}
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3" style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                  Categories
                </h6>
                <div className="d-flex flex-column gap-1">
                  <button
                    className="btn text-start py-2 px-3 border-0 w-100 d-flex align-items-center gap-2"
                    onClick={() => setCategoryFilter("")}
                    style={{
                      borderRadius: "var(--radius-sm)",
                      background: !categoryFilter ? "var(--primary-light)" : "transparent",
                      color: !categoryFilter ? "var(--primary)" : "var(--text-secondary)",
                      fontWeight: !categoryFilter ? 700 : 500,
                      fontSize: "0.9rem",
                    }}
                  >
                    🏷️ All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      className="btn text-start py-2 px-3 border-0 w-100 d-flex align-items-center gap-2"
                      onClick={() => setCategoryFilter(cat.name)}
                      style={{
                        borderRadius: "var(--radius-sm)",
                        background: categoryFilter === cat.name ? "var(--primary-light)" : "transparent",
                        color: categoryFilter === cat.name ? "var(--primary)" : "var(--text-secondary)",
                        fontWeight: categoryFilter === cat.name ? 700 : 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h6 className="fw-bold mb-3 d-flex justify-content-between" style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                  <span>Price Range</span>
                  <span style={{ color: "var(--primary)", textTransform: "none", letterSpacing: "0" }}>
                    ₹{priceRange.toLocaleString("en-IN")}
                  </span>
                </h6>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max={maxPriceLimit || 100000}
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between small mt-1" style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                  <span>₹0</span>
                  <span>₹{(maxPriceLimit || 100000).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Listing Main Section */}
          <div className="col-lg-9">

            {/* Control Bar */}
            <div
              className="d-flex flex-wrap justify-content-between align-items-center p-3 mb-4"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-outline-primary d-lg-none d-flex align-items-center gap-2"
                  onClick={() => setShowMobileFilters(true)}
                  style={{ fontSize: "0.88rem" }}
                >
                  <FiFilter size={15} /> Filters
                </button>
                <div className="d-none d-sm-block" style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  Showing <strong style={{ color: "var(--text-primary)" }}>{sortedProducts.length}</strong> {sortedProducts.length === 1 ? "product" : "products"}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="d-none d-sm-inline" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Sort by:</span>
                <select
                  className="form-select py-1 px-3"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: "180px", height: "38px", fontSize: "0.88rem" }}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters Modal */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-end"
                  style={{ zIndex: 1100, background: "rgba(45, 41, 38, 0.4)" }}
                  onClick={() => setShowMobileFilters(false)}
                >
                  <motion.div
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    exit={{ x: 300 }}
                    className="h-100 p-4 w-75 overflow-auto"
                    style={{ backgroundColor: "var(--bg-card)", maxWidth: "360px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0 fw-bold">Filters</h5>
                      <button
                        className="btn p-1 border-0 shadow-none"
                        onClick={() => setShowMobileFilters(false)}
                        style={{ color: "var(--text-primary)" }}
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold mb-3" style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                        Categories
                      </h6>
                      <div className="d-flex flex-column gap-1">
                        <button
                          className="btn text-start py-2 px-3 border-0 w-100"
                          onClick={() => { setCategoryFilter(""); setShowMobileFilters(false); }}
                          style={{
                            borderRadius: "var(--radius-sm)",
                            background: !categoryFilter ? "var(--primary-light)" : "transparent",
                            color: !categoryFilter ? "var(--primary)" : "var(--text-secondary)",
                            fontWeight: !categoryFilter ? 700 : 500,
                          }}
                        >
                          All Categories
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.name}
                            className="btn text-start py-2 px-3 border-0 w-100 d-flex align-items-center gap-2"
                            onClick={() => { setCategoryFilter(cat.name); setShowMobileFilters(false); }}
                            style={{
                              borderRadius: "var(--radius-sm)",
                              background: categoryFilter === cat.name ? "var(--primary-light)" : "transparent",
                              color: categoryFilter === cat.name ? "var(--primary)" : "var(--text-secondary)",
                              fontWeight: categoryFilter === cat.name ? 700 : 500,
                            }}
                          >
                            {cat.icon} {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 d-flex justify-content-between" style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        <span>Price Range</span>
                        <span style={{ color: "var(--primary)" }}>₹{priceRange.toLocaleString("en-IN")}</span>
                      </h6>
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max={maxPriceLimit || 100000}
                        step="500"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                      />
                    </div>

                    <button className="btn btn-primary w-100 py-2 mb-2" onClick={() => setShowMobileFilters(false)}>
                      Apply Filters
                    </button>
                    <button className="btn btn-outline-primary w-100 py-2" onClick={() => { handleClearFilters(); setShowMobileFilters(false); }}>
                      Clear All
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <motion.div
              className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {sortedProducts.length === 0 ? (
                <div className="col-12 text-center my-5 py-5" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <h5 style={{ color: "var(--text-muted)" }}>No products match your current filters.</h5>
                  <button className="btn btn-outline-primary mt-3" onClick={handleClearFilters}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                sortedProducts.map((product) => {
                  const { id, brand, name, price, productAvailable, imageData, stockQuantity } = product;

                  return (
                    <motion.div
                      className="col"
                      key={id}
                      variants={itemVariants}
                    >
                      <div
                        className="h-100 d-flex flex-column"
                        style={{
                          backgroundColor: "var(--bg-card)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "var(--radius-lg)",
                          overflow: "hidden",
                          boxShadow: "var(--shadow-xs)",
                          transition: "transform 0.25s ease, box-shadow 0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-6px)";
                          e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "var(--shadow-xs)";
                        }}
                      >
                        <Link to={`/product/${id}`} className="text-decoration-none d-flex flex-column h-100">
                          {/* Image Container */}
                          <div
                            className="p-3 d-flex align-items-center justify-content-center position-relative"
                            style={{ height: "210px", overflow: "hidden", backgroundColor: "var(--bg-secondary)" }}
                          >
                            {/* Stock badges */}
                            {stockQuantity === 0 ? (
                              <span
                                className="position-absolute custom-badge custom-badge-danger"
                                style={{ top: "12px", left: "12px" }}
                              >
                                Out of Stock
                              </span>
                            ) : stockQuantity <= 5 ? (
                              <span
                                className="position-absolute custom-badge custom-badge-warning"
                                style={{ top: "12px", left: "12px" }}
                              >
                                Low Stock ({stockQuantity})
                              </span>
                            ) : (
                              <span
                                className="position-absolute custom-badge custom-badge-success"
                                style={{ top: "12px", left: "12px" }}
                              >
                                In Stock
                              </span>
                            )}

                            <img
                              src={convertBase64ToDataURL(imageData)}
                              alt={name}
                              className="img-fluid"
                              style={{ maxHeight: "170px", objectFit: "contain", transition: "transform 0.4s ease" }}
                              onError={(e) => {
                                e.target.src = unplugged;
                              }}
                            />
                          </div>

                          {/* Body details */}
                          <div className="p-4 d-flex flex-column flex-grow-1" style={{ borderTop: "1px solid var(--border-color)" }}>
                            <span
                              className="text-uppercase fw-bold"
                              style={{ fontSize: "0.7rem", letterSpacing: "0.06em", color: "var(--text-muted)" }}
                            >
                              {brand}
                            </span>
                            <h6
                              className="fw-bold text-truncate mb-2 mt-1 text-capitalize"
                              style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}
                              title={name}
                            >
                              {name}
                            </h6>

                            <div className="mt-auto pt-3 d-flex align-items-center justify-content-between">
                              <div>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Price</span>
                                <h5 className="mb-0 fw-bold" style={{ color: "var(--text-primary)" }}>
                                  ₹{price.toLocaleString("en-IN")}
                                </h5>
                              </div>

                              <div className="d-flex gap-2">
                                {/* Quick View Button */}
                                <button
                                  className="btn p-2 d-flex align-items-center justify-content-center"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(`/product/${id}`);
                                  }}
                                  style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "var(--radius-sm)",
                                    border: "1.5px solid var(--border-color)",
                                    color: "var(--text-secondary)",
                                    backgroundColor: "var(--bg-card)",
                                  }}
                                >
                                  <FiEye size={16} />
                                </button>

                                {/* Cart Button */}
                                <button
                                  className="btn btn-primary p-2 d-flex align-items-center justify-content-center"
                                  onClick={(e) => handleAddToCart(e, product)}
                                  disabled={!productAvailable || stockQuantity === 0}
                                  style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "0",
                                    minWidth: "38px",
                                  }}
                                  title="Add to cart"
                                >
                                  <FiShoppingCart size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;