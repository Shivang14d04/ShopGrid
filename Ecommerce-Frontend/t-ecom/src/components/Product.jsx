import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "../axios";
import { toast } from "react-toastify";
import { FiShoppingCart, FiEdit, FiTrash2, FiPlus, FiMinus, FiArrowLeft } from "react-icons/fi";
import unplugged from "../assets/unplugged.png";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData, currentUser, data: allProducts } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        } else {
          setImageUrl(unplugged);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get(`/product/${id}/image`, { responseType: "blob" });
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageUrl(unplugged);
      }
    };

    fetchProduct();
    // Reset quantity back to 1 when changing products
    setQty(1);
  }, [id]);

  const deleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/product/${id}`);
        removeFromCart(id);
        toast.success("Product deleted successfully");
        refreshData();
        navigate("/");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`Added ${qty} ${product.name} to cart`);
  };

  const handleIncreaseQty = () => {
    if (qty < product.stockQuantity) {
      setQty(qty + 1);
    } else {
      toast.info("Cannot select more than available stock");
    }
  };

  const handleDecreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  // Find related products in the same category
  const relatedProducts = allProducts
    ? allProducts
      .filter((p) => p.category === product?.category && p.id !== product?.id)
      .slice(0, 4)
    : [];

  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return unplugged;
    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  if (loading || !product) {
    return (
      <div className="container mt-5 pt-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const inStock = product.productAvailable && product.stockQuantity > 0;

  return (
    <div className="main-layout" style={{ minHeight: "100vh" }}>
      <div className="container px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm mb-4 d-inline-flex align-items-center gap-2 border shadow-none"
        >
          <FiArrowLeft /> Back to products
        </button>

        <div className="row g-5">
          {/* Left Column - Product Image Card */}
          <div className="col-md-6">
            <div className="premium-card p-4 border text-center d-flex align-items-center justify-content-center image-zoom-container" style={{ minHeight: "400px", backgroundColor: "var(--bg-secondary)" }}>
              <img
                src={imageUrl || unplugged}
                alt={product.name}
                className="img-fluid"
                style={{ maxHeight: "400px", objectFit: "contain", borderRadius: "var(--radius-md)" }}
                onError={(e) => { e.target.src = unplugged; }}
              />
            </div>
          </div>

          {/* Right Column - Product details info panel */}
          <div className="col-md-6">
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="custom-badge custom-badge-info">{product.category}</span>
                  <small className="text-muted">
                    Release: {new Date(product.releaseDate).toLocaleDateString()}
                  </small>
                </div>

                <h1 className="fw-bold mb-2 text-capitalize" style={{ color: "var(--text-primary)" }}>{product.name}</h1>
                <p className="text-muted mb-4 fst-italic">Brand: <span className="fw-semibold">{product.brand}</span></p>

                {/* Stock Status Badge */}
                <div className="mb-4">
                  {product.stockQuantity === 0 ? (
                    <span className="custom-badge custom-badge-danger">Out of Stock</span>
                  ) : product.stockQuantity <= 5 ? (
                    <span className="custom-badge custom-badge-warning">Low Stock: Only {product.stockQuantity} Left!</span>
                  ) : (
                    <span className="custom-badge custom-badge-success">In Stock ({product.stockQuantity} units available)</span>
                  )}
                </div>

                <div className="mb-4">
                  <h6 className="fw-semibold mb-2">Description</h6>
                  <p className="text-secondary" style={{ lineHeight: "1.6" }}>{product.description}</p>
                </div>
              </div>

              <div>
                {/* Price Display */}
                <div className="d-flex align-items-baseline gap-2 mb-4">
                  <span className="text-muted small">Price:</span>
                  <h2 className="fw-bold mb-0" style={{ color: "var(--primary)" }}>₹{product.price.toLocaleString("en-IN")}</h2>
                </div>

                {/* Purchase Actions (Quantity and Add to Cart) */}
                {inStock ? (
                  <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                    <div className="d-flex align-items-center border rounded-sm" style={{ backgroundColor: "var(--bg-card)" }}>
                      <button
                        className="btn btn-link text-secondary p-2 border-0 shadow-none"
                        onClick={handleDecreaseQty}
                        disabled={qty <= 1}
                      >
                        <FiMinus />
                      </button>
                      <span className="px-3 fw-bold text-center" style={{ minWidth: "40px" }}>{qty}</span>
                      <button
                        className="btn btn-link text-secondary p-2 border-0 shadow-none"
                        onClick={handleIncreaseQty}
                        disabled={qty >= product.stockQuantity}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <button
                      className="btn btn-primary px-4 py-2.5 flex-grow-1"
                      onClick={handleAddToCart}
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-primary w-100 py-2.5 mb-4" disabled>
                    Out of Stock
                  </button>
                )}

                {/* Admin-only Controls */}
                {currentUser?.role === "ROLE_ADMIN" && (
                  <div className="border-top pt-4 mt-2">
                    <h6 className="fw-semibold text-danger mb-3">Admin Actions</h6>
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                        type="button"
                        onClick={handleEditClick}
                      >
                        <FiEdit size={16} /> Update Details
                      </button>

                      <button
                        className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                        type="button"
                        onClick={deleteProduct}
                      >
                        <FiTrash2 size={16} /> Delete Product
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-5 pt-5 border-top">
            <h3 className="fw-bold mb-4">Related Products</h3>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
              {relatedProducts.map((p) => (
                <div key={p.id} className="col">
                  <div className="premium-card h-100 d-flex flex-column border">
                    <Link to={`/product/${p.id}`} className="text-decoration-none text-dark d-flex flex-column h-100">
                      <div className="image-zoom-container p-3 d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                        <img
                          src={convertBase64ToDataURL(p.imageData)}
                          alt={p.name}
                          className="img-fluid"
                          style={{ maxHeight: "120px", objectFit: "contain" }}
                          onError={(e) => { e.target.src = unplugged; }}
                        />
                      </div>
                      <div className="card-body p-3 d-flex flex-column flex-grow-1 border-top">
                        <span className="text-uppercase text-muted fw-bold" style={{ fontSize: "0.7rem" }}>{p.brand}</span>
                        <h6 className="card-title fw-semibold text-truncate mb-2 text-capitalize" style={{ fontSize: "0.9rem" }}>{p.name}</h6>
                        <h6 className="mb-0 fw-bold mt-auto">₹{p.price.toLocaleString("en-IN")}</h6>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;