import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, ShieldCheck, Truck, ArrowRight, Gift, Heart, Cake, PartyPopper, Crown, Star } from "lucide-react";

function Home() {
  const [banner, setBanner] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: "/src/assets/events/shells-water.jpg",
      title: "Rafayel's Birthday Event",
      subtitle: "celebrate rafayles birthday with a limited edition set in collaboration with love and deepspace!",
      link: "/products?search=Merfolk%20Eyeshadow",
      isBirthday: true
    },
    {
      image: "/src/assets/events/payday-sale.jpg",
      title: "Payday Special Sale",
      subtitle: "Discover curated makeup sets and premium skincare essentials at sweet prices",
      link: "/products?search=sale",
      isBirthday: false
    }
  ];

  const user = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    fetchBanner();
    fetchRecommended();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/settings"
      );

      if (
        res.data &&
        res.data.banner
      ) {
        setBanner(
          res.data.banner
        );
      }
    } catch (error) {
      console.error(
        "Error fetching homepage settings:",
        error
      );
    }
  };

  const fetchRecommended =
    async () => {
      try {
        const res =
          await axios.get(
            "http://localhost:8000/api/products"
          );

        const shuffled =
          [...res.data].sort(
            () =>
              0.5 -
              Math.random()
          );

        setRecommended(
          shuffled.slice(0, 4)
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
      {banner && (
        <div style={{
          backgroundColor: "var(--color-tertiary)",
          color: "var(--text-heading)",
          padding: "12px 20px",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "14px",
          letterSpacing: "0.5px",
        }}>
          {banner}
        </div>
      )}

      {/* Swipeable Event Banner Carousel */}
      <div className="container" style={{ marginTop: "40px", marginBottom: "20px" }}>
        <div className="carousel-container">
          <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
            {slides.map((slide, index) => (
              <div
                key={index}
                className="carousel-slide"
                style={{
                  position: index === 0 ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  opacity: currentSlide === index ? 1 : 0,
                  visibility: currentSlide === index ? "visible" : "hidden",
                  transition: "opacity 0.8s ease-in-out, visibility 0.8s",
                  zIndex: currentSlide === index ? 1 : 0
                }}
              >
                {/* Image Container on Top */}
                <div
                  className="carousel-image"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(58, 45, 51, 0.15), rgba(58, 45, 51, 0.35)), url(${slide.image})`,
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(slide.link)}
                >
                  {/* Floating Rafayel pics if it's the Rafayel slide */}
                  {index === 0 && (
                    <>
                      <img src="/src/assets/events/rafayel-merman1.jpg" alt="Rafayel Merman" className="decor-pic decor-pic-1" />
                      <img src="/src/assets/events/rafayel-merman2.jpg" alt="Rafayel Merman" className="decor-pic decor-pic-2" />
                      <img src="/src/assets/events/rafayel-cat.jpg" alt="Rafayel Cat" className="decor-pic decor-pic-3" />
                      <img src="/src/assets/events/rafayel-paint.jpg" alt="Rafayel Paint" className="decor-pic decor-pic-4" />
                      
                      {/* Simple, clean floating decorative icons */}
                      <Crown className="floating-decor-icon" style={{ top: "35px", left: "47%", color: "#fef08a", animationDelay: "0s" }} size={24} />
                      <Sparkles className="floating-decor-icon" style={{ top: "110px", left: "33%", color: "#ffd1dc", animationDelay: "0.5s" }} size={18} />
                      <Sparkles className="floating-decor-icon" style={{ top: "110px", right: "33%", color: "#ffd1dc", animationDelay: "1s" }} size={18} />
                      <Heart className="floating-decor-icon" style={{ top: "210px", left: "49%", color: "#e88d9f", animationDelay: "1.5s" }} size={16} />
                    </>
                  )}
                </div>

                {/* Text Block Underneath */}
                <div className="carousel-content">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <span className="badge badge-stock" style={{ marginBottom: "6px", display: "inline-block", fontSize: "0.75rem" }}>
                        Featured Event
                      </span>
                      <h2 className="carousel-title">{slide.title}</h2>
                    </div>
                    <Link to={slide.link}>
                      <button className="btn btn-primary" style={{ padding: "10px 24px", fontSize: "0.85rem" }}>
                        Explore Deal <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                  
                  {slide.isBirthday ? (
                    <p className="carousel-subtitle" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <Sparkles size={11} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                      <Cake size={11} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                      <span>{slide.subtitle}</span>
                      <PartyPopper size={11} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                      <Sparkles size={11} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    </p>
                  ) : (
                    <p className="carousel-subtitle">{slide.subtitle}</p>
                  )}

                  {slide.isBirthday && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "14px" }}>
                      <span style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        fontWeight: "800",
                        color: "#d15c71",
                        backgroundColor: "#ffd8e0",
                        padding: "5px 14px",
                        borderRadius: "12px",
                        letterSpacing: "0.5px",
                        display: "inline-block",
                        boxShadow: "0 2px 8px rgba(232, 141, 159, 0.12)"
                      }}>
                        happy birthday Rafayle
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dot Indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "16px" }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: currentSlide === index ? "var(--color-primary)" : "var(--border-medium)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hero Welcome Text */}
      <div className="container" style={{ textAlign: "center", padding: "60px 20px 60px" }}>
        <h1 className="heading-hero">
          Rose and Roots
        </h1>
        <p style={{ fontSize: "20px", color: "var(--text-muted)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 30px" }}>
          Your destination for premium makeup, skincare, and beauty tools. Let your inner beauty blossom.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link to="/products">
            <button className="btn btn-primary">
              Shop Collection <ArrowRight size={18} />
            </button>
          </Link>

          {!user && (
            <Link to="/register">
              <button className="btn btn-outline">
                Join Now
              </button>
            </Link>
          )}

          {user && (
            <Link to="/profile">
              <button className="btn btn-outline">
                My Profile
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Brand Value Props */}
      <div style={{ backgroundColor: "var(--color-surface)", padding: "60px 0", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center", gap: "60px", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", maxWidth: "250px" }}>
            <div style={{ background: "var(--color-background)", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--color-primary)" }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ marginBottom: "12px" }}>Premium Quality</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Curated makeup and skincare for the perfect glow.</p>
          </div>

          <div style={{ textAlign: "center", maxWidth: "250px" }}>
            <div style={{ background: "var(--color-background)", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--color-primary)" }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ marginBottom: "12px" }}>Secure Checkout</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Your information stays completely protected with us.</p>
          </div>

          <div style={{ textAlign: "center", maxWidth: "250px" }}>
            <div style={{ background: "var(--color-background)", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--color-primary)" }}>
              <Truck size={28} />
            </div>
            <h3 style={{ marginBottom: "12px" }}>Fast Delivery</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Quick and pristine delivery right to your doorstep.</p>
          </div>
        </div>
      </div>

      {/* Recommended For You Section at Bottom */}
      <div className="container" style={{ padding: "80px 20px" }}>
        <h2 className="heading-section">Recommended For You</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "30px" }}>
          {recommended.map((product) => (
            <div key={product._id} className="card-product">
              {product.image && (
                <img src={product.image} alt={product.name} />
              )}
              <div className="card-product-content">
                <h3 style={{ fontSize: "18px", marginBottom: "8px", flexGrow: 1 }}>{product.name}</h3>
                <p style={{ fontWeight: "700", color: "var(--color-primary)", fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>₹{product.price}</span>
                  {product.originalPrice && (
                    <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "14px", fontWeight: "400" }}>
                      ₹{product.originalPrice}
                    </span>
                  )}
                </p>
                <Link to="/products" style={{ width: "100%" }}>
                  <button className="btn btn-outline" style={{ width: "100%" }}>View Product</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;