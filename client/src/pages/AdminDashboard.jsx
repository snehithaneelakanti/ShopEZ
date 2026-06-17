import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { LayoutDashboard, ShoppingBag, Clock, CheckCircle2, DollarSign, Settings, ArrowRight } from "lucide-react";

function AdminDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const productsRes = await axios.get(
        "http://localhost:8000/api/products"
      );

      const ordersRes = await axios.get(
        "http://localhost:8000/api/orders/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orders = ordersRes.data;

      const revenue = orders.reduce((sum, order) => sum + order.totalAmount,0);

setTotalRevenue(revenue);

      setTotalProducts(productsRes.data.length);
      setTotalOrders(orders.length);

      setPendingOrders(
        orders.filter(
          (order) => order.status === "Pending"
        ).length
      );

      setDeliveredOrders(
        orders.filter(
          (order) => order.status === "Delivered"
        ).length
      );

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!user || user.usertype !== "Admin") {
    return (
      <div className="container text-center" style={{ padding: "80px 20px" }}>
        <h2 className="heading-section" style={{ color: "#e11d48" }}>Access Denied</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>You do not have permission to access the admin area.</p>
        <Link to="/">
          <button className="btn btn-primary">Return Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: "1000px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", borderBottom: "1px solid var(--border-light)", paddingBottom: "20px" }}>
        <LayoutDashboard size={32} color="var(--color-primary)" />
        <h1 className="heading-section" style={{ margin: 0, textAlign: "left" }}>Admin Dashboard</h1>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        
        <div className="card" style={{ padding: "24px", textAlign: "center", background: "var(--color-surface)" }}>
          <ShoppingBag size={24} color="var(--color-primary)" style={{ marginBottom: "12px" }} />
          <h4 style={{ margin: "0 0 8px", color: "var(--text-muted)", fontWeight: "500", fontSize: "14px", textTransform: "uppercase" }}>Total Products</h4>
          <h2 style={{ margin: 0, fontSize: "32px", fontWeight: "700" }}>{totalProducts}</h2>
        </div>

        <div className="card" style={{ padding: "24px", textAlign: "center", background: "var(--color-surface)" }}>
          <ShoppingBag size={24} color="var(--color-secondary)" style={{ marginBottom: "12px" }} />
          <h4 style={{ margin: "0 0 8px", color: "var(--text-muted)", fontWeight: "500", fontSize: "14px", textTransform: "uppercase" }}>Total Orders</h4>
          <h2 style={{ margin: 0, fontSize: "32px", fontWeight: "700" }}>{totalOrders}</h2>
        </div>

        <div className="card" style={{ padding: "24px", textAlign: "center", background: "#fef3c7", border: "1px solid #fde68a" }}>
          <Clock size={24} color="#d97706" style={{ marginBottom: "12px" }} />
          <h4 style={{ margin: "0 0 8px", color: "#b45309", fontWeight: "500", fontSize: "14px", textTransform: "uppercase" }}>Pending Orders</h4>
          <h2 style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#b45309" }}>{pendingOrders}</h2>
        </div>

        <div className="card" style={{ padding: "24px", textAlign: "center", background: "#dcfce7", border: "1px solid #bbf7d0" }}>
          <CheckCircle2 size={24} color="#15803d" style={{ marginBottom: "12px" }} />
          <h4 style={{ margin: "0 0 8px", color: "#166534", fontWeight: "500", fontSize: "14px", textTransform: "uppercase" }}>Delivered Orders</h4>
          <h2 style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#166534" }}>{deliveredOrders}</h2>
        </div>

      </div>

      <div className="card" style={{ padding: "30px", textAlign: "center", background: "var(--color-surface)", marginBottom: "50px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <DollarSign size={32} color="#16a34a" />
        <h4 style={{ margin: 0, color: "var(--text-muted)", fontSize: "15px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Sales Revenue</h4>
        <h2 style={{ margin: 0, fontSize: "40px", fontWeight: "800", color: "#16a34a" }}>₹{totalRevenue}</h2>
      </div>

      {/* Navigation Buttons */}
      <h3 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px" }}>Quick Actions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        
        <Link to="/admin/products" style={{ textDecoration: "none" }}>
          <div className="card-product" style={{ padding: "24px", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", height: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "var(--text-heading)" }}>Manage Products</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Add, edit, or delete items from catalog</p>
              </div>
              <ArrowRight size={20} color="var(--color-primary)" />
            </div>
          </div>
        </Link>

        <Link to="/admin/orders" style={{ textDecoration: "none" }}>
          <div className="card-product" style={{ padding: "24px", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", height: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "var(--text-heading)" }}>Manage Orders</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Track statuses and update delivery states</p>
              </div>
              <ArrowRight size={20} color="var(--color-primary)" />
            </div>
          </div>
        </Link>

        <Link to="/admin/settings" style={{ textDecoration: "none" }}>
          <div className="card-product" style={{ padding: "24px", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", height: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "var(--text-heading)" }}>Store Settings</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Configure store banner and product categories</p>
              </div>
              <ArrowRight size={20} color="var(--color-primary)" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}

export default AdminDashboard;