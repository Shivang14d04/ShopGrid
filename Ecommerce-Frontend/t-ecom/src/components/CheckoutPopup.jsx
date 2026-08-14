import axios from '../axios';
import React, { useContext, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppContext from '../Context/Context';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {
  const { isAuthenticated, clearCart } = useContext(AppContext);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    phone: "",
    paymentMethod: "cod"
  });

  if (!isAuthenticated) {
    return (
      <Modal show={show} onHide={handleClose} centered contentClassName="border-0 shadow">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold">Sign In Required</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Alert variant="warning" className="d-flex align-items-center gap-2 border-0 bg-warning-subtle text-warning-emphasis">
            <FiAlertTriangle size={20} />
            <span>Please sign in to your account to complete checkout.</span>
          </Alert>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4">
          <Button variant="secondary" onClick={handleClose} className="px-4">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate('/login')} className="px-4">
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);

    const orderItems = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    try {
      const response = await axios.post(`/orders/place`, { items: orderItems });
      console.log(response, 'order placed');

      clearCart();
      localStorage.removeItem('cart');
      
      // Close the modal and show success toast via the existing ToastContainer
      setTimeout(() => {
        handleClose();
        navigate('/orders');
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" contentClassName="border-0 shadow-lg">
      <Modal.Header closeButton className="px-4 pt-4 border-0">
        <Modal.Title className="fw-bold" style={{ letterSpacing: "-0.5px" }}>Checkout Securely</Modal.Title>
      </Modal.Header>
      
      <Form noValidate validated={validated} onSubmit={handleConfirm}>
        <Modal.Body className="px-4 pb-4">
          <div className="row g-4">
            {/* Left: Delivery details form */}
            <div className="col-md-6 border-end pe-md-4">
              <h6 className="fw-bold mb-3 border-bottom pb-2">Delivery Information</h6>
              
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your name
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Shipping Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, City, ZIP"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your delivery address
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your phone number
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Payment Method</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={shippingInfo.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="cod">Cash on Delivery (COD)</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="upi">UPI / Net Banking</option>
                </Form.Select>
              </Form.Group>
            </div>

            {/* Right: Order breakdown */}
            <div className="col-md-6 ps-md-4">
              <h6 className="fw-bold mb-3 border-bottom pb-2">Your Order Summary</h6>
              
              <div className="checkout-items mb-3 overflow-auto" style={{ maxHeight: "200px" }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex align-items-center mb-3">
                    <img
                      src={`${import.meta.env.VITE_BASE_URL || 'http://localhost:8080'}/api/product/${item.id}/image`}
                      alt={item.name}
                      className="rounded border me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="mb-0 text-truncate fw-semibold text-capitalize" style={{ fontSize: "0.85rem" }}>{item.name}</h6>
                      <small className="text-muted d-block">{item.quantity} x ₹{item.price.toLocaleString("en-IN")}</small>
                    </div>
                    <div className="fw-bold ms-2 text-nowrap" style={{ fontSize: "0.85rem" }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-light rounded-sm mb-3" style={{ borderRadius: "var(--radius-sm)" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold mb-0">Grand Total</span>
                  <h4 className="fw-bold mb-0 text-primary">₹{totalPrice.toLocaleString("en-IN")}</h4>
                </div>
              </div>

              <Alert variant="info" className="mb-0 border-0 bg-info-subtle text-info-emphasis d-flex align-items-start gap-2 py-2.5 small">
                <FiCheckCircle size={18} className="mt-0.5" />
                <span>Orders will automatically associate with your authenticated profile credentials.</span>
              </Alert>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="px-4 pb-4 border-0">
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting} className="px-4 shadow-none">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting} className="px-4 shadow-none">
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing Order...
              </>
            ) : 'Confirm Purchase'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CheckoutPopup;