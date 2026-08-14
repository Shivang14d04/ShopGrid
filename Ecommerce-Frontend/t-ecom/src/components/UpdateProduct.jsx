import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-toastify";
import { FiSave, FiUploadCloud, FiFileText, FiArchive, FiArrowLeft, FiZap } from "react-icons/fi";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  const [imageChanged, setImageChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        setUpdateProduct(response.data);
      
        const responseImage = await axios.get(`/product/${id}/image`, { responseType: "blob" });
        const imageFile = await converUrlToFile(responseImage.data, response.data.imageName);
        setImage(imageFile);
        
        // Setup image preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(imageFile);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product information");
      }
    };

    fetchProduct();
  }, [id]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleGenerateDescription = async () => {
    if (!updateProduct.name?.trim() || !updateProduct.category) {
      toast.warning("Please fill in Product Name and Category first to generate a description.");
      return;
    }
    setAiLoading(true);
    try {
      const response = await axios.post(`/product/generate-description`, null, {
        params: { name: updateProduct.name, category: updateProduct.category },
      });
      setUpdateProduct({ ...updateProduct, description: response.data });
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
    setUpdateProduct({ ...updateProduct, [name]: fieldValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImageChanged(true);
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!updateProduct.name?.trim()) newErrors.name = "Product name is required";
    if (!updateProduct.brand?.trim()) newErrors.brand = "Brand is required";
    if (!updateProduct.description?.trim()) newErrors.description = "Description is required";
    if (!updateProduct.price || parseFloat(updateProduct.price) <= 0) newErrors.price = "Price must be greater than zero";
    if (!updateProduct.category) newErrors.category = "Please select a category";
    if (updateProduct.stockQuantity === "" || parseInt(updateProduct.stockQuantity) < 0) {
      newErrors.stockQuantity = "Stock quantity cannot be negative";
    }
    if (!updateProduct.releaseDate) newErrors.releaseDate = "Release date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (imageChanged && image) {
      formData.append("imageFile", image);
    } else {
      formData.append("imageFile", null);
    }
    
    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    axios
      .put(`/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Product updated successfully");
        navigate(`/product/${id}`);
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        toast.error("Failed to update product. Please try again.");
        setLoading(false);
      });
  };

  if (!product.id) {
    return (
      <div className="container mt-5 pt-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout" style={{ minHeight: "100vh" }}>
      <div className="container px-4" style={{ maxWidth: "800px" }}>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary btn-sm mb-4 d-inline-flex align-items-center gap-2 border shadow-none"
        >
          <FiArrowLeft /> Back
        </button>

        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: "-1px" }}>Update Product</h1>
          <p className="text-secondary">Modify active parameters of this listing</p>
        </div>

        <div className="premium-card p-4 p-md-5 border shadow-sm" style={{ backgroundColor: "var(--bg-card)" }}>
          <form noValidate onSubmit={handleSubmit} className="row g-4">
            
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
                  value={updateProduct.name}
                  onChange={handleInputChange}
                  placeholder={product.name}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div>
                <label className="small fw-semibold mb-1">Brand Name</label>
                <input
                  type="text"
                  name="brand"
                  className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                  value={updateProduct.brand}
                  onChange={handleInputChange}
                  placeholder={product.brand}
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
                  value={updateProduct.description}
                  onChange={handleInputChange}
                  placeholder={product.description}
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
                    value={updateProduct.price}
                    onChange={handleInputChange}
                    placeholder={product.price}
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                <div className="col-6">
                  <label className="small fw-semibold mb-1">Category</label>
                  <select
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    value={updateProduct.category}
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
                    value={updateProduct.stockQuantity}
                    onChange={handleInputChange}
                    placeholder={product.stockQuantity}
                  />
                  {errors.stockQuantity && <div className="invalid-feedback">{errors.stockQuantity}</div>}
                </div>

                <div className="col-6">
                  <label className="small fw-semibold mb-1">Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    className={`form-control ${errors.releaseDate ? 'is-invalid' : ''}`}
                    value={updateProduct.releaseDate ? updateProduct.releaseDate.slice(0, 10) : ''}
                    onChange={handleInputChange}
                  />
                  {errors.releaseDate && <div className="invalid-feedback">{errors.releaseDate}</div>}
                </div>
              </div>

              {/* Upload image area Dropzone */}
              <div>
                <label className="small fw-semibold mb-2">Product Image</label>
                <div 
                  className="border rounded p-3 text-center position-relative"
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
                      <div className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>
                        {imageChanged ? "New selection" : "Current image"}
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-secondary">
                      <FiUploadCloud size={32} className="mb-2 text-primary" />
                      <div className="small fw-bold">Click to replace product image</div>
                      <div className="small text-muted" style={{ fontSize: "0.75rem" }}>Supports PNG, JPG (max 5MB)</div>
                    </div>
                  )}
                </div>
                <div className="form-text mt-1 text-muted small">Leave image empty to keep the existing selection</div>
              </div>

              <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="productAvailable"
                  id="productAvailable"
                  checked={updateProduct.productAvailable}
                  onChange={(e) =>
                    setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
                  }
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
                onClick={() => navigate(-1)}
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
                    <FiSave /> Save Changes
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

export default UpdateProduct;