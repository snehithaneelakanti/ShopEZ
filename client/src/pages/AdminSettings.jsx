import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Settings, Plus, X, Save, AlertCircle, CheckCircle2 } from "lucide-react";

function AdminSettings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [banner, setBanner] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.usertype !== "Admin") {
      navigate("/");
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/settings");
        if (res.data) {
          setBanner(res.data.banner || "");
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user, navigate]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.put(
        "http://localhost:8000/api/admin/settings",
        { banner, categories },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message || "Settings updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update settings");
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setError("Category already exists");
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategory("");
    setError("");
  };

  const handleRemoveCategory = (catToRemove) => {
    setCategories(categories.filter((cat) => cat !== catToRemove));
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading settings...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: "800px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-primary)", textDecoration: "none", fontWeight: "600" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", borderBottom: "1px solid var(--border-light)", paddingBottom: "20px" }}>
        <Settings size={32} color="var(--color-primary)" />
        <h1 className="heading-section" style={{ margin: 0, textAlign: "left" }}>Store Settings</h1>
      </div>

      {message && (
        <div style={{ padding: "16px", backgroundColor: "#dcfce7", color: "#15803d", borderRadius: "12px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #bbf7d0", fontWeight: "500" }}>
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {error && (
        <div style={{ padding: "16px", backgroundColor: "#fee2e2", color: "#ef4444", borderRadius: "12px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #fecaca", fontWeight: "500" }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="card" style={{ padding: "30px" }}>
        <div className="form-group" style={{ marginBottom: "30px" }}>
          <label htmlFor="banner" className="form-label">
            Homepage Banner Text
          </label>
          <textarea
            id="banner"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className="form-input"
            style={{ minHeight: "100px", resize: "vertical" }}
            placeholder="Enter promotional or welcome banner message..."
          />
        </div>

        <div className="form-group" style={{ marginBottom: "40px" }}>
          <label className="form-label">
            Product Categories
          </label>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. lips, eyes, tools"
              className="form-input"
              style={{ marginBottom: 0 }}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="btn btn-primary"
              style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={18} /> Add
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {categories.map((cat) => (
              <span
                key={cat}
                className="badge badge-stock"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: "var(--color-tertiary)",
                  color: "var(--text-heading)",
                  border: "none",
                  borderRadius: "20px"
                }}
              >
                {cat}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {categories.length === 0 && (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>No categories added yet.</p>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px" }}>
          <Save size={18} /> Save Settings
        </button>
      </form>
    </div>
  );
}

export default AdminSettings;
