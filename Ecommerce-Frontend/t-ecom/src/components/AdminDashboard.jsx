import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "../axios";
import { toast } from "react-toastify";
import { FiTrendingUp, FiShoppingBag, FiAlertTriangle, FiPlus, FiEdit, FiTrash2, FiSearch, FiLayers } from "react-icons/fi";
import unplugged from "../assets/unplugged.png";

const AdminDashboard = () => {
  const { data: products, refreshData, removeFromCart } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
    refreshData();
  }, [refreshData]);

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/product/${id}`);
        removeFromCart(id);
        toast.success("Product deleted successfully");
        refreshData();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  // Metrics calculations
  const totalProducts = products?.length || 0;
  const lowStockProducts = products?.filter((p) => p.stockQuantity <= 5).length || 0;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((acc, order) => {
    const orderSum = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
    return acc + orderSum;
  }, 0);

  // Filter products by search query
  const filteredProducts = products ? products.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const brand = (p.brand || "").toLowerCase();
    const cat = (p.category || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || brand.includes(query) || cat.includes(query);
  }) : [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="main-layout" style={{ minHeight: "100vh" }}>
      <div className="container px-4">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h1 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>Admin Dashboard</h1>
            <p className="text-secondary mb-0">Overview of store sales, catalog, and inventory status</p>
          </div>
          <Link to="/add_product" className="btn btn-primary d-flex align-items-center gap-2 shadow-none">
            <FiPlus /> Add Product
          </Link>
        </div>

        {/* Analytics Grid */}
        <div className="row g-4 mb-5">
          {/* Card 1: Total Sales */}
          <div className="col-md-3 col-sm-6">
            <div className="premium-card p-4 border shadow-sm h-100" style={{ backgroundColor: "var(--bg-card)" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small fw-bold text-uppercase">Total Revenue</span>
                <span className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "var(--primary-light)", color: "var(--primary)" }}>
                  <FiTrendingUp size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>
                {loadingOrders ? "..." : formatCurrency(totalSales)}
              </h3>
              <p className="text-muted small mb-0">Accumulated orders total</p>
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="col-md-3 col-sm-6">
            <div className="premium-card p-4 border shadow-sm h-100" style={{ backgroundColor: "var(--bg-card)" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small fw-bold text-uppercase">Total Orders</span>
                <span className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "var(--success-light)", color: "var(--success-color)" }}>
                  <FiShoppingBag size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>
                {loadingOrders ? "..." : totalOrders}
              </h3>
              <p className="text-muted small mb-0">Placed customer invoices</p>
            </div>
          </div>

          {/* Card 3: Total Products */}
          <div className="col-md-3 col-sm-6">
            <div className="premium-card p-4 border shadow-sm h-100" style={{ backgroundColor: "var(--bg-card)" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small fw-bold text-uppercase">Total Catalog</span>
                <span className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "var(--info-light)", color: "var(--info-color)" }}>
                  <FiLayers size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>{totalProducts}</h3>
              <p className="text-muted small mb-0">Active catalog items</p>
            </div>
          </div>

          {/* Card 4: Low Stock Alert */}
          <div className="col-md-3 col-sm-6">
            <div className="premium-card p-4 border shadow-sm h-100" style={{ backgroundColor: "var(--bg-card)" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small fw-bold text-uppercase">Low Stock Alert</span>
                <span className={`p-2 rounded-circle d-flex align-items-center justify-content-center`} style={{ width: "40px", height: "40px", background: lowStockProducts > 0 ? 'var(--danger-light)' : 'var(--bg-secondary)', color: lowStockProducts > 0 ? 'var(--danger-color)' : 'var(--text-muted)' }}>
                  <FiAlertTriangle size={20} />
                </span>
              </div>
              <h3 className={`fw-bold mb-1 ${lowStockProducts > 0 ? 'text-danger' : ''}`} style={{ color: lowStockProducts > 0 ? '' : 'var(--text-primary)' }}>
                {lowStockProducts}
              </h3>
              <p className="text-muted small mb-0">Stock level &le; 5 units</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="premium-card p-4 mb-5 border shadow-sm" style={{ backgroundColor: "var(--bg-card)" }}>
          <h5 className="fw-bold mb-3">Admin Quick Operations</h5>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/add_product" className="btn btn-outline-primary shadow-none">
              <FiPlus /> Add New Product
            </Link>
            <Link to="/orders" className="btn btn-secondary shadow-none">
              <FiShoppingBag /> View All Orders
            </Link>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="premium-card border shadow-sm" style={{ backgroundColor: "var(--bg-card)" }}>
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0">Catalog Inventory</h5>
            <div className="position-relative" style={{ width: "260px" }}>
              <span className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted">
                <FiSearch size={16} />
              </span>
              <input
                type="text"
                className="form-control ps-5 py-1.5"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 text-secondary small text-uppercase">Item</th>
                  <th className="py-3 text-secondary small text-uppercase">Category</th>
                  <th className="py-3 text-secondary small text-uppercase text-end">Price</th>
                  <th className="py-3 text-secondary small text-uppercase text-center">Stock</th>
                  <th className="py-3 text-secondary small text-uppercase">Status</th>
                  <th className="px-4 py-3 text-secondary small text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No products found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isAvailable = p.productAvailable && p.stockQuantity > 0;
                    
                    return (
                      <tr key={p.id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={p.imageData ? `data:image/jpeg;base64,${p.imageData}` : unplugged}
                              alt={p.name}
                              className="rounded border"
                              style={{ width: "40px", height: "40px", objectFit: "contain", backgroundColor: "#fff" }}
                              onError={(e) => { e.target.src = unplugged; }}
                            />
                            <div>
                              <div className="fw-semibold text-capitalize">{p.name}</div>
                              <div className="text-muted small">{p.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="custom-badge custom-badge-info">{p.category}</span>
                        </td>
                        <td className="py-3 text-end fw-bold text-primary">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`fw-bold ${p.stockQuantity <= 5 ? 'text-danger' : ''}`}>
                            {p.stockQuantity}
                          </span>
                        </td>
                        <td className="py-3">
                          {isAvailable ? (
                            <span className="custom-badge custom-badge-success">Available</span>
                          ) : (
                            <span className="custom-badge custom-badge-danger">Unavailable</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              onClick={() => navigate(`/product/update/${p.id}`)}
                              className="btn btn-outline-primary btn-sm p-2 rounded-circle"
                              style={{ width: "36px", height: "36px", minWidth: "36px" }}
                              title="Edit product"
                            >
                              <FiEdit size={14} />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="btn btn-outline-danger btn-sm p-2 rounded-circle"
                              style={{ width: "36px", height: "36px", minWidth: "36px" }}
                              title="Delete product"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
