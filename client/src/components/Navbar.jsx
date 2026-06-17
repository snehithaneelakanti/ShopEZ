import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, User, LogOut, Settings, Home, Package } from "lucide-react";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchCartCount = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/cart/${userId}`
      );

      const data = await res.json();

      if (data?.products) {
        const totalItems = data.products
          .filter(item => item.productId)
          .reduce(
            (sum, item) => sum + item.quantity,
            0
          );

        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.log(error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");

      if (stored) {
        try {
          const parsedUser = JSON.parse(stored);

          setUser(parsedUser);

          if (
            parsedUser.usertype !== "Admin"
          ) {
            fetchCartCount(parsedUser._id);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
        setCartCount(0);
      }
    };

    loadUser();

    window.addEventListener(
      "storage",
      loadUser
    );

    window.addEventListener(
      "auth-change",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );

      window.removeEventListener(
        "auth-change",
        loadUser
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setCartCount(0);

    window.dispatchEvent(
      new Event("auth-change")
    );

    navigate("/");
  };

  const linkStyle = {
    color: "var(--text-heading)",
    textDecoration: "none",
    marginRight: "24px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "600",
    transition: "color 0.2s ease"
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 40px",
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--border-light)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 10px rgba(183, 110, 121, 0.05)"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "28px", letterSpacing: "0.5px" }}>
            Rose and Roots
          </h2>
        </Link>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", marginTop: "-2px", letterSpacing: "1px", textTransform: "uppercase" }}>
          Premium Makeup & Skincare
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>
          <Home size={18} /> Home
        </Link>
        <Link to="/products" style={linkStyle}>
          <Package size={18} /> Products
        </Link>

        {user ? (
          <>
            {user.usertype === "Admin" ? (
              <Link to="/admin" style={{ ...linkStyle, color: "var(--color-primary)" }}>
                <Settings size={18} /> Admin Dashboard
              </Link>
            ) : (
              <>
                <Link to="/cart" style={linkStyle}>
                  <ShoppingCart size={18} /> Cart
                  {cartCount > 0 && (
                    <span style={{
                      background: "var(--color-primary)",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      marginLeft: "4px"
                    }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" style={{ ...linkStyle, color: "var(--color-primary)" }}>
                  <User size={18} /> Hi, {user.username}
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                border: "1px solid var(--border-medium)",
                color: "var(--text-main)",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.color = "var(--color-primary)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--border-medium)";
                e.currentTarget.style.color = "var(--text-main)";
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              <User size={18} /> Login
            </Link>
            <Link to="/register" style={{
              ...linkStyle,
              marginRight: 0,
              background: "var(--color-primary)",
              color: "white",
              padding: "8px 20px",
              borderRadius: "20px"
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;