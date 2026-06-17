import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const user = getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8000/api/cart/${user._id}`
      );

      if (!res.data) {
        setCart({ products: [] });
      } else {
        setCart(res.data);
      }

    } catch (error) {
      console.log(error);
      setCart({ products: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    const user = getUser();

    if (!user) return;

    try {
      await axios.post(
        "http://localhost:8000/api/cart/add",
        {
          userId: user._id,
          productId,
          quantity: 1,
        }
      );

      fetchCart();

      window.dispatchEvent(
        new Event("auth-change")
      );

    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (
    productId
  ) => {
    const user = getUser();

    if (!user) return;

    try {
      await axios.delete(
        "http://localhost:8000/api/cart/remove",
        {
          data: {
            userId: user._id,
            productId,
          },
        }
      );

      fetchCart();

      window.dispatchEvent(
        new Event("auth-change")
      );

    } catch (error) {
      console.log(error);
    }
  };

  const getTotal = () => {
    if (!cart?.products) return 0;

    return cart.products.reduce(
      (sum, item) => {
        if (!item.productId)
          return sum;

        return (
          sum +
          item.productId.price *
            item.quantity
        );
      },
      0
    );
  };

  if (loading) {
    return (
      <p style={{ padding: "20px" }}>
        Loading cart...
      </p>
    );
  }

  const user = getUser();

  if (!user) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <ShoppingBag size={48} color="var(--border-medium)" style={{ marginBottom: "20px" }} />
        <h2 className="heading-section" style={{ fontSize: "24px" }}>Please login to view your cart.</h2>
        <Link to="/login">
          <button className="btn btn-primary">Login Now</button>
        </Link>
      </div>
    );
  }

  // Admin Protection

  if (user.usertype === "Admin") {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>
          Admin accounts do not use
          carts.
        </h2>

        <p>
          Please use the Admin
          Dashboard to manage
          products and orders.
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px", maxWidth: "800px" }}>
      <h1 className="heading-section" style={{ textAlign: "left", marginBottom: "30px" }}>My Shopping Bag</h1>

      {!cart?.products || cart.products.filter((item) => item.productId).length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--color-surface)", borderRadius: "16px", border: "1px dashed var(--border-medium)" }}>
          <ShoppingBag size={48} color="var(--border-medium)" style={{ marginBottom: "20px" }} />
          <h3 style={{ marginBottom: "16px", color: "var(--text-heading)" }}>Your bag is empty</h3>
          <Link to="/products">
            <button className="btn btn-primary">Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cart.products
              .filter((item) => item.productId)
              .map((item) => (
                <div
                  key={item._id}
                  style={{
                    border: "1px solid var(--border-light)",
                    padding: "20px",
                    borderRadius: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--color-surface)",
                    boxShadow: "var(--shadow-soft)",
                    gap: "20px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", flexGrow: 1 }}>
                    {item.productId.image && (
                      <img src={item.productId.image} alt={item.productId.name} style={{ width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover" }} />
                    )}
                    <div>
                      <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>{item.productId.name}</h3>
                      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "15px" }}>₹{item.productId.price} each</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-medium)", borderRadius: "30px", padding: "4px 8px" }}>
                      <button
                        onClick={() => removeFromCart(item.productId._id)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--text-main)" }}
                      >
                        {item.quantity === 1 ? <Trash2 size={16} color="#e11d48" /> : <Minus size={16} />}
                      </button>

                      <span style={{ fontWeight: "600", minWidth: "30px", textAlign: "center" }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => addToCart(item.productId._id)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--text-main)" }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div style={{ width: "80px", textAlign: "right", fontWeight: "700", fontSize: "18px", color: "var(--color-primary)" }}>
                      ₹{item.productId.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div style={{ marginTop: "40px", borderTop: "1px solid var(--border-medium)", paddingTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-heading)" }}>
              Total: <span style={{ color: "var(--color-primary)" }}>₹{getTotal()}</span>
            </span>

            <Link to="/checkout">
              <button className="btn btn-primary">
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;