import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, User, Mail, MapPin, Calendar, DollarSign, CheckCircle2 } from "lucide-react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/orders/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:8000/api/orders/status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Status Updated");

      fetchOrders();

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

      <h1 className="heading-section" style={{ textAlign: "left", marginBottom: "30px" }}>Manage Orders</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {orders.map((order) => (
          <div key={order._id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--border-light)", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "var(--color-tertiary)", padding: "10px", borderRadius: "10px", color: "var(--text-heading)" }}>
                  <Package size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Order ID: #{order._id.slice(-8)}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: "600", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>

              <div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="form-input"
                  style={{
                    padding: "8px 12px",
                    marginBottom: 0,
                    width: "auto",
                    fontWeight: "600",
                    borderRadius: "20px",
                    fontSize: "14px",
                    backgroundColor: order.status === "Delivered" ? "#dcfce7" : order.status === "Pending" ? "#fef3c7" : "#dbeafe",
                    color: order.status === "Delivered" ? "#166534" : order.status === "Pending" ? "#b45309" : "#1e40af",
                    border: "none"
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <h4 style={{ margin: "0 0 10px", fontSize: "15px", fontWeight: "600" }}>Customer Info</h4>
                <p style={{ margin: "0 0 6px", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}><User size={14} color="var(--text-muted)" /> {order.userId?.username}</p>
                <p style={{ margin: 0, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}><Mail size={14} color="var(--text-muted)" /> {order.userId?.email}</p>
              </div>
              <div>
                <h4 style={{ margin: "0 0 10px", fontSize: "15px", fontWeight: "600" }}>Shipping Details</h4>
                <p style={{ margin: 0, fontSize: "14px", display: "flex", alignItems: "flex-start", gap: "6px" }}><MapPin size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: "2px" }} /> {order.shippingAddress}</p>
              </div>
            </div>

            <div style={{ background: "var(--color-background)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Items</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {order.products.map((item) => (
                  <div key={item._id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span>{item.productId?.name} <span style={{ color: "var(--text-muted)" }}>× {item.quantity}</span></span>
                    <span style={{ fontWeight: "600" }}>₹{item.productId?.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingTop: "16px", borderTop: "1px dashed var(--border-medium)" }}>
              <div style={{ fontWeight: "700", fontSize: "18px", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                Total Paid: ₹{order.totalAmount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;