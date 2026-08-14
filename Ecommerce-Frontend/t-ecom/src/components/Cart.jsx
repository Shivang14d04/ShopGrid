import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import CheckoutPopup from "./CheckoutPopup";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import unplugged from "../assets/unplugged.png";

const Cart = () => {
  const { cart, removeFromCart, isAuthenticated } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cart.length ? cart : []);
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          toast.info("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
    // Sync with localStorage
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(item.quantity - 1, 1) };
      }
      return item;
    });
    setCartItems(newCartItems);
    // Sync with localStorage
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to place your order");
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    setShowModal(true);
  };

  const shippingCost = totalPrice > 2000 || totalPrice === 0 ? 0 : 150;
  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="main-layout" style={{ minHeight: "100vh" }}>
      <div className="container px-4">
        <h1 className="fw-bold mb-4" style={{ letterSpacing: "-1px" }}>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-5 bg-white rounded border shadow-sm" style={{ backgroundColor: "var(--bg-card)" }}>
            <svg 
              className="mb-4 text-muted" 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="10" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h3 className="fw-bold mb-2">Your Cart is Empty</h3>
            <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: "360px" }}>
              Looks like you haven't added anything to your cart yet. Head back to the store to find some products!
            </p>
            <Link to="/" className="btn btn-primary px-4 py-2.5 shadow-none">
              <FiShoppingBag /> Explore Store
            </Link>
          </div>
        ) : (
          /* Split Layout */
          <div className="row g-4">
            {/* Left Column: Cart items list */}
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="premium-card p-3 d-flex flex-column flex-sm-row align-items-center gap-3 border shadow-sm"
                    style={{ backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)" }}
                  >
                    {/* Item Image */}
                    <div 
                      className="d-flex align-items-center justify-content-center border rounded bg-white"
                      style={{ width: "90px", height: "90px", minWidth: "90px", overflow: "hidden" }}
                    >
                      <img
                        src={`${import.meta.env.VITE_BASE_URL || 'http://localhost:8080'}/api/product/${item.id}/image`}
                        alt={item.name}
                        style={{ maxWidth: "80px", maxHeight: "80px", objectFit: "contain" }}
                        onError={(e) => {
                          e.target.src = unplugged;
                        }}
                      />
                    </div>

                    {/* Item details */}
                    <div className="flex-grow-1 text-center text-sm-start w-100">
                      <span className="text-muted text-uppercase fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                        {item.brand}
                      </span>
                      <h6 className="fw-bold mb-1 text-capitalize" style={{ color: "var(--text-primary)" }}>{item.name}</h6>
                      <div className="text-primary fw-semibold">₹{item.price.toLocaleString("en-IN")}</div>
                    </div>

                    {/* Quantity Selector stepper */}
                    <div className="d-flex align-items-center border rounded-sm" style={{ backgroundColor: "var(--bg-primary)" }}>
                      <button 
                        className="btn btn-link text-secondary p-1 border-0 shadow-none"
                        onClick={() => handleDecreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-3 fw-bold text-center" style={{ minWidth: "30px" }}>{item.quantity}</span>
                      <button 
                        className="btn btn-link text-secondary p-1 border-0 shadow-none"
                        onClick={() => handleIncreaseQuantity(item.id)}
                        disabled={item.quantity >= item.stockQuantity}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    {/* Total Price & Action button */}
                    <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-4 w-100 w-sm-auto mt-2 mt-sm-0">
                      <div className="text-end d-none d-sm-block">
                        <span className="text-muted small">Total</span>
                        <div className="fw-bold" style={{ color: "var(--text-primary)" }}>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                      
                      <button
                        className="btn btn-outline-danger p-2 rounded-circle"
                        style={{ width: "38px", height: "38px", minWidth: "38px" }}
                        onClick={() => handleRemoveFromCart(item.id)}
                        title="Remove product"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary sticky card */}
            <div className="col-lg-4">
              <div 
                className="card border-0 shadow-sm p-4 sticky-top" 
                style={{ top: "100px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}
              >
                <h5 className="fw-bold mb-4" style={{ color: "var(--text-primary)" }}>Order Summary</h5>

                <div className="d-flex flex-column gap-3 mb-4 border-bottom pb-4">
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Subtotal ({cartItems.length} items)</span>
                    <span className="fw-semibold">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Delivery Charge</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-success fw-bold">FREE</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>

                  {shippingCost > 0 && (
                    <div className="alert alert-warning py-2 mb-0 small text-center" style={{ borderRadius: "var(--radius-sm)" }}>
                      Add ₹{(2000 - totalPrice).toLocaleString("en-IN")} more for free delivery!
                    </div>
                  )}

                  <div className="d-flex justify-content-between small text-muted">
                    <span>GST (Inclusive)</span>
                    <span>₹0</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0">Total Amount</h6>
                  <h4 className="fw-bold mb-0 text-primary">₹{grandTotal.toLocaleString("en-IN")}</h4>
                </div>

                <button 
                  className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow-none"
                  onClick={handleCheckout}
                >
                  {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"} <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={grandTotal}
      />
    </div>
  );
};

export default Cart;