import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Eye } from "lucide-react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/settings");
      if (res.data && res.data.categories) {
        setCategories(res.data.categories);
        if (res.data.categories.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: prev.category || res.data.categories[0],
          }));
        }
      }
    } catch (error) {
      console.log("Failed to load categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/products"
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Added");

      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: "",
      });

      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Failed To Add Product");
    }
  };

  const deleteProduct = async (id) => {

    if ( !window.confirm(
    "Are you sure you want to delete this product?"
  )
)
  return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:8000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Deleted");

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);

    setEditData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
  };

  const saveProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8000/api/products/${editingId}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Updated");

      setEditingId(null);

      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-primary)", textDecoration: "none", fontWeight: "600" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <h1 className="heading-section" style={{ textAlign: "left", marginBottom: "30px" }}>Manage Products</h1>

      {/* Add Product Form */}
      <div className="card" style={{ padding: "30px", marginBottom: "40px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={20} color="var(--color-primary)" /> Add New Product
        </h3>

        <form onSubmit={handleAddProduct}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price (INR)</label>
              <input
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              placeholder="Highly pigmented and hydrating lipstick balm..."
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows={3}
              style={{ resize: "vertical" }}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                style={{ width: "100%", padding: "12px" }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "30px" }}>
            <label className="form-label">Image URL / Path</label>
            <input
              name="image"
              placeholder="e.g. /src/assets/products/lipbalm.jpg"
              value={formData.image}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px" }}>
            <Plus size={18} /> Add Product
          </button>
        </form>
      </div>

      <h2 className="heading-section" style={{ textAlign: "left", fontSize: "24px", marginBottom: "24px" }}>All Products ({products.length})</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {products.map((product) => (
          <div key={product._id} className="card" style={{ padding: "24px" }}>
            {editingId === product._id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (INR)</label>
                    <input
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="form-input"
                    rows={2}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      className="form-input"
                      style={{ padding: "12px" }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      value={editData.stock}
                      onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button onClick={saveProduct} className="btn btn-primary" style={{ padding: "10px 20px" }}>
                    <Save size={16} /> Save Changes
                  </button>
                  <button onClick={() => setEditingId(null)} className="btn btn-outline" style={{ padding: "10px 20px" }}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "12px", border: "1px solid var(--border-light)" }}
                  />
                )}

                <div style={{ flexGrow: 1, minWidth: "250px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ margin: 0, fontSize: "20px" }}>{product.name}</h3>
                    <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--color-primary)" }}>₹{product.price}</span>
                  </div>

                  <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px" }}>{product.description}</p>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginBottom: "20px" }}>
                    <span className="badge badge-stock">{product.category}</span>
                    <span className="badge badge-stock" style={{ background: "var(--color-background)", color: "var(--text-main)" }}>Stock: {product.stock}</span>
                    {product.stock === 0 ? (
                      <span className="badge badge-low-stock" style={{ background: "#fee2e2", color: "#ef4444" }}>Out of Stock</span>
                    ) : product.stock <= 5 ? (
                      <span className="badge badge-low-stock">Low Stock</span>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => editProduct(product)} className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => deleteProduct(product._id)} className="btn" style={{ padding: "8px 16px", fontSize: "0.9rem", backgroundColor: "#fee2e2", color: "#ef4444" }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;