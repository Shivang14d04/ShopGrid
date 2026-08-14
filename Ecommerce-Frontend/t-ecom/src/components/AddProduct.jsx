import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiPlus, FiUploadCloud, FiTrash2, FiFileText, FiDollarSign, FiCalendar, FiArchive, FiZap } from "react-icons/fi";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: true, // Default to true for ease of use
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleGenerateDescription = async () => {
    if (!product.name.trim() || !product.category) {
      toast.warning("Please fill in Product Name and Category first to generate a description.");
      return;
    }
    setAiLoading(true);
    try {
      const response = await axios.post(`/product/generate-description`, null, {
        params: { name: product.name, category: product.category },
      });
      setProduct({ ...product, description: response.data });
      if (errors.description) setErrors({ ...errors, description: null });
      toast.success("AI description generated!");
    } catch (err) {
      const errMsg = typeof err?.response?.data === 'string' ? err.response.data : "Failed to generate description. Please try manually.";
      toast.error(errMsg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setProduct({ ...product, [name]: fieldValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: "Please select a valid image file (JPEG or PNG)",
        });
      } else if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
      } else {
        setErrors({ ...errors, image: null });
      }
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.brand.trim()) newErrors.brand = "Brand is required";
    if (!product.description.trim()) newErrors.description = "Description is required";
    if (!product.price || parseFloat(product.price) <= 0) newErrors.price = "Price must be greater than zero";
    if (!product.category) newErrors.category = "Please select a category";
    if (!product.stockQuantity || parseInt(product.stockQuantity) < 0) {
      newErrors.stockQuantity = "Stock quantity cannot be negative";
    }
    if (!product.releaseDate) newErrors.releaseDate = "Release date is required";
    if (!image) newErrors.image = "Product image is required";
    if (errors.image) newErrors.image = errors.image; // Keep existing image error if size/type validation failed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    
    if (!validateForm() || !form.checkValidity()) {
      event.stopPropagation();
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post(`/product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        toast.success("Product added successfully");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Error adding product");
        setLoading(false);
      });
  };

  return (
    <div className="main-layout" style={{ minHeight: "100vh" }}>
      <div className="container px-4" style={{ maxWidth: "800px" }}>
        
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>Add New Product</h1>
          <p className="text-secondary">Create a new product listing in catalog</p>
        </div>

        <div className="premium-card p-4 p-md-5 border shadow-sm" style={{ backgroundColor: "var(--bg-card)" }}>
          <form noValidate onSubmit={submitHandler} className="row g-4">
            
            {/* Left Col: Info details */}
            <div className="col-md-6 d-flex flex-column gap-3">
              <h6 className="fw-bold mb-2 pb-2 border-bottom d-flex align-items-center gap-2">
                <FiFileText /> General Information
              </h6>
              
              <div>
                <label className="small fw-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="e.g. MacBook Pro 16"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div>
                <label className="small fw-semibold mb-1">Brand Name</label>
                <input
                  type="text"
                  name="brand"
                  className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                  value={product.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. Apple"
                />
                {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="small fw-semibold">Description</label>
                  <button
                    type="button"
                    className="btn btn-link p-0 border-0 shadow-none d-flex align-items-center gap-1"
                    style={{ fontSize: "0.78rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}
                    onClick={handleGenerateDescription}
                    disabled={aiLoading}
                    title="Generate description using AI"
                  >
                    {aiLoading ? (
                      <><span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px" }} /> Generating...</>
                    ) : (
                      <><FiZap size={13} /> Generate with AI</>
                    )}
                  </button>
                </div>
                <textarea
                  name="description"
                  rows={4}
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  value={product.description}
                  onChange={handleInputChange}
                  placeholder={"Provide product specs and details, or use Generate with AI..."}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>
            </div>

            {/* Right Col: Logistics & Pricing */}
            <div className="col-md-6 d-flex flex-column gap-3">
              <h6 className="fw-bold mb-2 pb-2 border-bottom d-flex align-items-center gap-2">
                <FiArchive /> Inventory & Pricing
              </h6>
              
              <div className="row g-2">
                <div className="col-6">
                  <label className="small fw-semibold mb-1">Price (INR)</label>
                  <input
                    type="number"
                    name="price"
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    value={product.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                <div className="col-6">
                  <label className="small fw-semibold mb-1">Category</label>
                  <select
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    value={product.category}
                    onChange={handleInputChange}
                    name="category"
                  >
                    <option value="">Select category</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Toys">Toys</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <label className="small fw-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    className={`form-control ${errors.stockQuantity ? 'is-invalid' : ''}`}
                    value={product.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                  {errors.stockQuantity && <div className="invalid-feedback">{errors.stockQuantity}</div>}
                </div>

                <div className="col-6">
                  <label className="small fw-semibold mb-1">Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    className={`form-control ${errors.releaseDate ? 'is-invalid' : ''}`}
                    value={product.releaseDate}
                    onChange={handleInputChange}
                  />
                  {errors.releaseDate && <div className="invalid-feedback">{errors.releaseDate}</div>}
                </div>
              </div>

              {/* Upload image area Dropzone */}
              <div>
                <label className="small fw-semibold mb-2">Product Image</label>
                <div 
                  className={`border rounded p-3 text-center position-relative ${errors.image ? 'border-danger' : ''}`}
                  style={{ 
                    borderStyle: "dashed", 
                    backgroundColor: "var(--bg-primary)",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="file"
                    className="position-absolute start-0 top-0 w-100 h-100 opacity-0"
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg"
                    style={{ cursor: "pointer" }}
                  />
                  {imagePreview ? (
                    <div className="position-relative d-inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-fluid rounded border mb-2"
                        style={{ maxHeight: "110px", objectFit: "contain" }}
                      />
                      <div className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>{image?.name}</div>
                    </div>
                  ) : (
                    <div className="py-2 text-secondary">
                      <FiUploadCloud size={32} className="mb-2 text-primary" />
                      <div className="small fw-bold">Click to upload product image</div>
                      <div className="small text-muted" style={{ fontSize: "0.75rem" }}>Supports PNG, JPG (max 5MB)</div>
                    </div>
                  )}
                </div>
                {errors.image && <div className="text-danger small mt-1">{errors.image}</div>}
              </div>

              <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="productAvailable"
                  id="productAvailable"
                  checked={product.productAvailable}
                  onChange={handleInputChange}
                />
                <label className="form-check-label small fw-semibold" htmlFor="productAvailable">
                  Product is active & available for sale
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="col-12 mt-4 pt-3 border-top d-flex gap-2 justify-content-end">
              <button 
                type="button" 
                className="btn btn-secondary px-4 shadow-none"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-4 shadow-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Saving product...
                  </>
                ) : (
                  <>
                    <FiPlus /> Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
