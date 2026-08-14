import React, { useContext, useEffect, useState } from 'react';
import axios from '../axios';
import AppContext from '../Context/Context';
import { FiSearch, FiChevronDown, FiChevronUp, FiCalendar, FiDollarSign, FiClock, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Order = () => {
  const { currentUser } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const endpoint = currentUser?.role === 'ROLE_ADMIN' ? '/orders' : '/orders/my-orders';
        const response = await axios.get(endpoint);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="custom-badge custom-badge-info">Placed</span>;
      case 'SHIPPED':
        return <span className="custom-badge custom-badge-warning">Shipped</span>;
      case 'DELIVERED':
        return <span className="custom-badge custom-badge-success">Delivered</span>;
      case 'CANCELLED':
        return <span className="custom-badge custom-badge-danger">Cancelled</span>;
      default:
        return <span className="custom-badge">{status}</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    const orderIdStr = String(order.orderId || "");
    const customerName = (order.customerName || "").toLowerCase();
    const customerEmail = (order.email || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesQuery = orderIdStr.includes(query) || customerName.includes(query) || customerEmail.includes(query);
    const matchesStatus = statusFilter === "ALL" ? true : order.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  // Sorting Logic
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const totalA = calculateOrderTotal(a.items);
    const totalB = calculateOrderTotal(b.items);

    if (sortBy === "date-desc") {
      return new Date(b.orderDate) - new Date(a.orderDate);
    } else if (sortBy === "date-asc") {
      return new Date(a.orderDate) - new Date(b.orderDate);
    } else if (sortBy === "price-desc") {
      return totalB - totalA;
    } else if (sortBy === "price-asc") {
      return totalA - totalB;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const orderStatuses = ["ALL", "PLACED", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="main-layout" style={{ minHeight: "100vh" }}>
      <div className="container px-4">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>
              {currentUser?.role === 'ROLE_ADMIN' ? 'Order Management' : 'My Orders'}
            </h1>
            <p className="text-secondary mb-0">Track and monitor status transactions</p>
          </div>
        </div>

        {/* Dashboard Filters & controls */}
        <div 
          className="p-4 mb-4 rounded-md shadow-sm border d-flex flex-column gap-3"
          style={{ backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)", borderColor: "var(--border-color)" }}
        >
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by Order ID, Client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="col-md-3">
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-desc">Total: High to Low</option>
                <option value="price-asc">Total: Low to High</option>
              </select>
            </div>

            {/* Status Tabs (Desktop scrollable inline) */}
            <div className="col-md-4 d-flex align-items-center">
              <div className="d-flex gap-1 overflow-auto w-100 pb-1">
                {orderStatuses.map((status) => (
                  <button
                    key={status}
                    className={`btn btn-sm text-nowrap rounded-sm border-0 py-1.5 px-3 ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List Container */}
        {sortedOrders.length === 0 ? (
          <div className="text-center py-5 bg-white rounded border shadow-sm" style={{ backgroundColor: "var(--bg-card)" }}>
            <FiShoppingBag size={48} className="text-muted mb-3" />
            <h5 className="fw-bold mb-2">No Orders Found</h5>
            <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: "300px" }}>
              We couldn't find any orders matching your search or filters.
            </p>
            <Link to="/" className="btn btn-primary px-4 py-2">Continue Shopping</Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="d-none d-md-block premium-card border shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light border-bottom">
                    <tr>
                      <th className="px-4 py-3 text-secondary small text-uppercase">Order ID</th>
                      <th className="py-3 text-secondary small text-uppercase">Customer Info</th>
                      <th className="py-3 text-secondary small text-uppercase">Purchase Date</th>
                      <th className="py-3 text-secondary small text-uppercase">Status</th>
                      <th className="py-3 text-secondary small text-uppercase text-center">Items</th>
                      <th className="py-3 text-secondary small text-uppercase text-end">Total price</th>
                      <th className="px-4 py-3 text-secondary small text-uppercase text-end">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.map((order) => (
                      <React.Fragment key={order.orderId}>
                        <tr style={{ cursor: "pointer" }} onClick={() => toggleOrderDetails(order.orderId)}>
                          <td className="px-4 py-3.5 fw-bold">#{order.orderId}</td>
                          <td className="py-3.5">
                            <div className="fw-semibold">{order.customerName}</div>
                            <div className="text-muted small">{order.email}</div>
                          </td>
                          <td className="py-3.5">{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td className="py-3.5">{getStatusBadge(order.status)}</td>
                          <td className="py-3.5 text-center fw-medium">{order.items.length}</td>
                          <td className="py-3.5 text-end fw-bold text-primary">
                            {formatCurrency(calculateOrderTotal(order.items))}
                          </td>
                          <td className="px-4 py-3.5 text-end">
                            <button 
                              className="btn btn-link text-primary p-0 border-0 text-decoration-none d-inline-flex align-items-center gap-1 shadow-none"
                              onClick={(e) => { e.stopPropagation(); toggleOrderDetails(order.orderId); }}
                            >
                              {expandedOrder === order.orderId ? <FiChevronUp /> : <FiChevronDown />} View
                            </button>
                          </td>
                        </tr>
                        {/* Expanded details dropdown row */}
                        {expandedOrder === order.orderId && (
                          <tr className="bg-light">
                            <td colSpan="7" className="p-0 border-top-0">
                              <div className="p-4" style={{ backgroundColor: "var(--bg-primary)" }}>
                                <h6 className="fw-bold mb-3">Order Items</h6>
                                <div className="premium-card bg-white border">
                                  <div className="table-responsive">
                                    <table className="table table-sm align-middle mb-0">
                                      <thead className="table-light">
                                        <tr>
                                          <th className="px-3 py-2">Item Name</th>
                                          <th className="py-2 text-center" style={{ width: "120px" }}>Quantity</th>
                                          <th className="px-3 py-2 text-end" style={{ width: "160px" }}>Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {order.items.map((item, index) => (
                                          <tr key={index}>
                                            <td className="px-3 py-2.5 fw-medium text-capitalize">{item.productName}</td>
                                            <td className="py-2.5 text-center fw-bold">{item.quantity}</td>
                                            <td className="px-3 py-2.5 text-end fw-bold text-secondary">{formatCurrency(item.totalPrice)}</td>
                                          </tr>
                                        ))}
                                        <tr className="bg-light">
                                          <td colSpan="2" className="px-3 py-3 text-end fw-bold">Estimated Grand Total:</td>
                                          <td className="px-3 py-3 text-end fw-bold text-primary" style={{ fontSize: "1.1rem" }}>
                                            {formatCurrency(calculateOrderTotal(order.items))}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards List View */}
            <div className="d-md-none d-flex flex-column gap-3">
              {sortedOrders.map((order) => (
                <div 
                  key={order.orderId}
                  className="premium-card p-3 border shadow-sm"
                  style={{ backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)" }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">Order #{order.orderId}</span>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>
                  
                  <div className="text-secondary small mb-3">
                    <div className="mb-1"><strong>Client:</strong> {order.customerName} ({order.email})</div>
                    <div><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center border-top pt-2">
                    <div>
                      <small className="text-muted d-block">Total</small>
                      <strong className="text-primary">{formatCurrency(calculateOrderTotal(order.items))}</strong>
                    </div>
                    
                    <button 
                      className="btn btn-outline-primary btn-sm px-3 py-1 d-inline-flex align-items-center gap-1 shadow-none"
                      onClick={() => toggleOrderDetails(order.orderId)}
                    >
                      {expandedOrder === order.orderId ? "Hide Items" : "View Items"} 
                      {expandedOrder === order.orderId ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>

                  {/* Mobile Expanded Items */}
                  {expandedOrder === order.orderId && (
                    <div className="mt-3 pt-3 border-top bg-light p-2 rounded" style={{ backgroundColor: "var(--bg-primary)" }}>
                      <h6 className="fw-bold small mb-2">Ordered Items:</h6>
                      <div className="d-flex flex-column gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center text-secondary small bg-white p-2 rounded border">
                            <span className="fw-medium text-truncate text-capitalize" style={{ maxWidth: "160px" }}>{item.productName}</span>
                            <span className="fw-semibold">Qty: {item.quantity}</span>
                            <span className="fw-bold text-dark">{formatCurrency(item.totalPrice)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Order;