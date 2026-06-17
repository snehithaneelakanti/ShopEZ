import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, ShieldCheck, MapPin, Phone } from "lucide-react";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [singleProduct, setSingleProduct] = useState(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get("productId");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAddress(user.address || "");
    setPhone(user.phone || "");

    if (productId) {
      fetchProduct();
    } else {
      fetchCart();
    }
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/products/${productId}`);
      setSingleProduct(res.data);
    } catch (err) {
      console.log("Error fetching product:", err);
      alert("Failed to load product details.");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/cart/${user._id}`);
      setCart(res.data);
    } catch (err) {
      console.log("Error fetching cart:", err);
    }
  };

  const getTotal = () => {
    if (productId) {
      return singleProduct ? singleProduct.price : 0;
    }
    if (!cart?.products) return 0;
    return cart.products
      .filter((item) => item.productId)
      .reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
      );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (productId && !singleProduct) return alert("Product not loaded.");
    if (!productId && !cart?.products?.length) return alert("Your cart is empty.");
    setPlacing(true);

    try {
      const token = localStorage.getItem("token");
      const products = productId
        ? [
            {
              productId: singleProduct._id,
              quantity: 1,
              size: "",
            },
          ]
        : cart.products
            .filter((item) => item.productId)
            .map((item) => ({
              productId: item.productId._id,
              quantity: item.quantity,
              size: "",
            }));

      await axios.post(
        "http://localhost:8000/api/orders/create",
        {
          userId: user._id,
          products,
          totalAmount: getTotal(),
          shippingAddress: address,
          phone,
          clearCart: !productId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.dispatchEvent(new Event("auth-change"));
      alert("Order placed successfully!");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setPlacing(false);
    }
  };

  if (productId && !singleProduct) return <div className="container text-center mt-4">Loading Product...</div>;
  if (!productId && !cart) return <div className="container text-center mt-4">Loading...</div>;

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: "800px" }}>
      <h1 className="heading-section" style={{ textAlign: "left", marginBottom: "30px" }}>Secure Checkout</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
        
        {/* Order Summary */}
        <div className="card" style={{ padding: "30px" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px" }}>Order Summary</h3>
          {productId ? (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span style={{ fontWeight: "600" }}>{singleProduct.name}</span>
              <span style={{ color: "var(--color-primary)", fontWeight: "700" }}>₹{singleProduct.price}</span>
            </div>
          ) : (
            cart.products?.map((item) => (
              <div key={item._id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontWeight: "600" }}>{item.productId.name} <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>x {item.quantity}</span></span>
                <span style={{ color: "var(--color-primary)", fontWeight: "700" }}>₹{item.productId.price * item.quantity}</span>
              </div>
            ))
          )}
          
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontSize: "20px", fontWeight: "700", color: "var(--text-heading)" }}>
            <span>Total</span>
            <span style={{ color: "var(--color-primary)" }}>₹{getTotal()}</span>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="card" style={{ padding: "30px" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px" }}>Shipping Details</h3>
          
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={16} /> Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} /> Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address"
                required
                rows={3}
                className="form-input"
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ background: "var(--color-background)", padding: "16px", borderRadius: "12px", marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "12px", border: "1px solid var(--border-medium)" }}>
              <ShieldCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "14px", color: "var(--text-main)" }}>
                <strong>Secure Payment Simulation</strong>
                <p style={{ margin: "4px 0 0" }}>This is a simulated checkout. No real charges will be made. Your data is protected by Rose and Roots.</p>
              </div>
            </div>

            <button type="submit" disabled={placing} className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}>
              {placing ? "Processing..." : <><CreditCard size={20} /> Place Order - ₹{getTotal()}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
