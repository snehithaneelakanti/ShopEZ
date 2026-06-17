import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Package, MapPin, Phone, Mail, Shield } from "lucide-react";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/orders/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const statusColor = (status) => {
    const map = {
      Pending: "#f59e0b",
      Processing: "#3b82f6",
      Shipped: "#8b5cf6",
      Delivered: "#10b981",
    };
    return map[status] || "#6b7280";
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: "800px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", borderBottom: "1px solid var(--border-light)", paddingBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ background: "var(--color-primary)", color: "white", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={32} />
          </div>
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: "28px", color: "var(--text-heading)", fontFamily: "var(--font-heading)" }}>Hi, {user.username} 👋</h1>
            <p style={{ margin: 0, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}><Mail size={14} /> {user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: "8px 16px" }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="card" style={{ marginBottom: "40px", padding: "30px" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px" }}>Account Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}><Phone size={14} /> Phone</p>
            <p style={{ fontWeight: "600", margin: 0 }}>{user.phone || "Not provided"}</p>
          </div>
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}><Shield size={14} /> Account Type</p>
            <p style={{ fontWeight: "600", margin: 0 }}>{user.usertype}</p>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14} /> Default Address</p>
            <p style={{ fontWeight: "600", margin: 0 }}>{user.address || "Not provided"}</p>
          </div>
        </div>
      </div>

      <h2 className="heading-section" style={{ textAlign: "left", fontSize: "24px", marginBottom: "20px" }}>Order History</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: "gray" }}>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card" style={{ marginBottom: "20px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "var(--color-tertiary)", padding: "10px", borderRadius: "10px", color: "var(--text-heading)" }}>
                  <Package size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Order #{order._id.slice(-8)}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: "600", color: "var(--text-heading)" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <span className={`badge badge-status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {order.products.map((item) => (
                <div key={item._id} style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
                  <span>{item.productId?.name || "Product"} <span style={{ color: "var(--text-muted)" }}>× {item.quantity}</span></span>
                  <span style={{ fontWeight: "600" }}>₹{item.productId?.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px dashed var(--border-medium)" }}>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                {order.shippingAddress && <><MapPin size={14} /> Ships to: {order.shippingAddress}</>}
              </div>
              <div style={{ fontWeight: "700", fontSize: "18px", color: "var(--color-primary)" }}>
                Total: ₹{order.totalAmount}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;
