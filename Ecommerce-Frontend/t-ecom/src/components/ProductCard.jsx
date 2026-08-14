import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiShoppingCart, FiHeart } from "react-icons/fi";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const fallbackImage = (imageData) => {
  if (!imageData) return unplugged;
  if (imageData.startsWith("data:") || imageData.startsWith("http")) return imageData;
  return `data:image/jpeg;base64,${imageData}`;
};

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(AppContext);
  const stock = product.stockQuantity ?? 0;
  const inStock = product.productAvailable && stock > 0;
  const inWishlist = isInWishlist ? isInWishlist(product.id) : false;

  return (
    <div
      className="card h-100 border-0 position-relative"
      style={{
        borderRadius: "var(--radius-md)",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        boxShadow: "0 2px 8px rgba(45, 41, 38, 0.04)",
        transition: "transform 0.22s ease-in-out, box-shadow 0.22s ease-in-out, border-color 0.22s ease",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(45, 41, 38, 0.08)";
        e.currentTarget.style.borderColor = "rgba(231, 111, 81, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(45, 41, 38, 0.04)";
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
    >
      {/* ── 1. Image Container ── */}
      <div
        className="position-relative w-100 d-flex align-items-center justify-content-center overflow-hidden"
        style={{
          height: "210px",
          backgroundColor: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-color)",
          padding: "1.25rem",
        }}
      >
        {/* Stock Badge - Top Left */}
        <div className="position-absolute" style={{ top: "12px", left: "12px", zIndex: 2 }}>
          {inStock ? (
            <span
              className="badge d-inline-flex align-items-center gap-1"
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                backgroundColor: "rgba(34, 197, 94, 0.12)",
                color: "#15803d",
                padding: "0.3rem 0.65rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                }}
              />
              IN STOCK
            </span>
          ) : (
            <span
              className="badge d-inline-flex align-items-center gap-1"
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.03em",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                color: "#b91c1c",
                padding: "0.3rem 0.65rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
              }}
            >
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Wishlist Button - Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (toggleWishlist) toggleWishlist(product);
          }}
          className="btn p-0 position-absolute d-flex align-items-center justify-content-center shadow-xs"
          style={{
            top: "12px",
            right: "12px",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(4px)",
            border: "1px solid var(--border-color)",
            color: inWishlist ? "#ef4444" : "var(--text-muted)",
            zIndex: 2,
            transition: "all 0.15s ease",
          }}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart size={16} fill={inWishlist ? "#ef4444" : "none"} />
        </button>

        {/* Product Image Link */}
        <Link to={`/product/${product.id}`} className="w-100 h-100 d-flex align-items-center justify-content-center">
          <img
            src={fallbackImage(product.imageData)}
            alt={product.name}
            style={{
              maxHeight: "165px",
              maxWidth: "85%",
              objectFit: "contain",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onError={(e) => {
              e.currentTarget.src = unplugged;
            }}
          />
        </Link>
      </div>

      {/* ── 2. Card Content Body ── */}
      <div className="p-3 p-md-4 d-flex flex-column flex-grow-1 justify-content-between gap-3">
        <div>
          {/* Brand Name */}
          <div
            className="text-uppercase fw-bold text-truncate mb-1"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
            }}
          >
            {product.brand || "Brand"}
          </div>

          {/* Product Title (Up to 2 lines clamp) */}
          <Link
            to={`/product/${product.id}`}
            className="text-decoration-none"
            style={{ color: "var(--text-primary)" }}
          >
            <h6
              className="fw-semibold mb-0"
              style={{
                fontSize: "0.95rem",
                lineHeight: "1.35",
                color: "var(--text-primary)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                height: "2.7em",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            >
              {product.name}
            </h6>
          </Link>
        </div>

        {/* ── 3. Bottom Row: Price & Action Buttons ── */}
        <div className="d-flex align-items-end justify-content-between pt-2 border-top" style={{ borderColor: "var(--border-color)" }}>
          {/* Price Block */}
          <div className="d-flex flex-column">
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Price
            </span>
            <span
              style={{
                fontSize: "1.15rem",
                fontWeight: "700",
                color: "var(--text-primary)",
                lineHeight: "1.2",
              }}
            >
              ₹{product.price ? product.price.toLocaleString("en-IN") : "0"}
            </span>
          </div>

          {/* Action Buttons (View + Cart) */}
          <div className="d-flex align-items-center gap-2">
            {/* View Details Button */}
            <Link
              to={`/product/${product.id}`}
              className="btn p-0 d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-card)",
                border: "1.5px solid var(--border-color)",
                color: "var(--text-secondary)",
                transition: "all 0.15s ease",
              }}
              title="View Details"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              <FiEye size={18} />
            </Link>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (inStock && addToCart) addToCart(product);
              }}
              disabled={!inStock}
              className="btn p-0 d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: inStock ? "var(--primary)" : "var(--border-color)",
                color: "#ffffff",
                border: "none",
                cursor: inStock ? "pointer" : "not-allowed",
                opacity: inStock ? 1 : 0.6,
                transition: "all 0.15s ease",
                boxShadow: inStock ? "0 2px 6px rgba(231, 111, 81, 0.25)" : "none",
              }}
              title={inStock ? "Add to Cart" : "Out of Stock"}
              onMouseEnter={(e) => {
                if (inStock) e.currentTarget.style.backgroundColor = "var(--primary-hover)";
              }}
              onMouseLeave={(e) => {
                if (inStock) e.currentTarget.style.backgroundColor = "var(--primary)";
              }}
            >
              <FiShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;