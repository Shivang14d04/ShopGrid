import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import Order from "./components/Order";

import SearchResults from "./components/SearchResults";
import Login from "./components/Login";
import Register from "./components/Register";
import AccessDenied from "./components/AccessDenied";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import ChatBot from "./components/ChatBot";
 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  return (
    <AppProvider>
      <BrowserRouter>
        <ToastContainer autoClose={2000}
          hideProgressBar={true} />
        <Navbar onSelectCategory={handleCategorySelect} />
        <div className="min-vh-100">
          <Routes>
            <Route
              path="/"
              element={
                <Home selectedCategory={selectedCategory} />
              }
            />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/add_product" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><AddProduct /></ProtectedRoute>} />
            <Route path="/product" element={<Product />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/update/:id" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><UpdateProduct /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]}><Order /></ProtectedRoute>} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<AccessDenied />} />
             
          </Routes>
        </div>
      </BrowserRouter>
      <ChatBot />
    </AppProvider>
  );
}

export default App;