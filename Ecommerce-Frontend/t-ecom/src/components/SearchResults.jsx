import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import unplugged from "../assets/unplugged.png";
import AppContext from "../Context/Context";
import { FiShoppingCart, FiEye, FiSearch } from "react-icons/fi";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.searchData) {
      setSearchData(location.state.searchData);
      setLoading(false);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return unplugged;
    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border" role="status" style={{ color: "var(--primary)" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout" style={{ minHeight: "100vh" }}>
      <div className="container px-4">
        <div className="mb-4">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>Search Results</h1>
          <p style={{ color: "var(--text-muted)" }}>{searchData.length} product(s) found</p>
        </div>

        {searchData.length === 0 ? (
          <div className="text-center py-5" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
            <FiSearch size={48} style={{ color: "var(--text-muted)" }} className="mb-3" />
            <h5 className="fw-bold mb-2">No products found</h5>
            <p style={{ color: "var(--text-muted)" }}>No products found matching your search criteria.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {searchData.map((product) => (
              <div key={product.id} className="col">
                <div className="h-100 d-flex flex-column" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
                  <div className="p-3 d-flex align-items-center justify-content-center" style={{ height: "200px", backgroundColor: "var(--bg-secondary)", cursor: "pointer" }} onClick={() => navigate(`/product/${product.id}`)}>
                    <img src={convertBase64ToDataURL(product.imageData)} className="img-fluid" alt={product.name} style={{ maxHeight: "170px", objectFit: "contain" }} />
                  </div>
                  <div className="p-4 d-flex flex-column flex-grow-1" style={{ borderTop: "1px solid var(--border-color)" }}>
                    <span className="text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{product.brand}</span>
                    <h6 className="fw-bold text-truncate mb-1 mt-1 text-capitalize" style={{ fontSize: "0.95rem" }}>{product.name}</h6>
                    <span className="custom-badge custom-badge-info mb-2 align-self-start">{product.category}</span>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }} className="mb-3">
                      {product.description?.length > 80 ? product.description.substring(0, 80) + "..." : product.description}
                    </p>
                    <h5 className="fw-bold mt-auto mb-3" style={{ color: "var(--primary)" }}>₹{product.price.toLocaleString('en-IN')}</h5>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1" onClick={() => navigate(`/product/${product.id}`)}>
                        <FiEye size={14} /> Details
                      </button>
                      <button className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1" onClick={() => { addToCart(product); toast.success(`Added ${product.name} to cart`); }} disabled={!product.productAvailable || product.stockQuantity <= 0}>
                        <FiShoppingCart size={14} /> {product.productAvailable && product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;