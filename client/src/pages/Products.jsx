import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ShoppingCart, CreditCard } from "lucide-react";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [categories, setCategories] = useState(["All"]);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search") || "";
    const categoryParam = params.get("category") || "All";

    setSearch(searchParam);
    setSelectedCategory(categoryParam);

    fetchProducts(searchParam, categoryParam);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/settings");
      if (res.data && res.data.categories) {
        setCategories(["All", ...res.data.categories]);
      }
    } catch (error) {
      // fall back to defaults if admin settings unreachable
      setCategories(["All", "Mobiles", "Electronics", "Fashion", "Sports", "Books"]);
    }
  };

  const fetchProducts = async (initialSearch, initialCategory) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/products"
      );

      setProducts(res.data);
      
      let filtered = [...res.data];
      const activeCat = initialCategory !== undefined ? initialCategory : selectedCategory;
      const activeSearch = initialSearch !== undefined ? initialSearch : search;

      if (activeCat && activeCat !== "All") {
        filtered = filtered.filter(
          (product) => product.category === activeCat
        );
      }

      if (activeSearch) {
        if (activeSearch.toLowerCase() === "sale") {
          filtered = filtered.filter((product) => product.originalPrice);
        } else {
          filtered = filtered.filter((product) =>
            product.name
              .toLowerCase()
              .includes(activeSearch.toLowerCase())
          );
        }
      }
      
      setFilteredProducts(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  const filterProducts = (
    searchText,
    category
  ) => {
    let filtered = [...products];

    if (category !== "All") {
      filtered = filtered.filter(
        (product) =>
          product.category === category
      );
    }

    if (searchText) {
      if (searchText.toLowerCase() === "sale") {
        filtered = filtered.filter((product) => product.originalPrice);
      } else {
        filtered = filtered.filter((product) =>
          product.name
            .toLowerCase()
            .includes(searchText.toLowerCase())
        );
      }
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    filterProducts(
      value,
      selectedCategory
    );
  };

  const handleCategory = (
    category
  ) => {
    setSelectedCategory(category);

    filterProducts(
      search,
      category
    );
  };

  const handleSort = (option) => {
    setSortOption(option);

    let sorted = [...filteredProducts];

    if (option === "low") {
      sorted.sort(
        (a, b) => a.price - b.price
      );
    }

    if (option === "high") {
      sorted.sort(
        (a, b) => b.price - a.price
      );
    }

    setFilteredProducts(sorted);
  };

  const addToCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/cart/add", {
        userId: user._id,
        productId,
        quantity: 1,
      });

      alert("Added To Cart");

      window.dispatchEvent(new Event("auth-change"));
    } catch (error) {
      console.log(error);
      alert("Failed To Add Product");
    }
  };

  const shopNow = (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    navigate(`/checkout?productId=${productId}`);
  };

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h1 className="heading-section">Our Collection</h1>

      {/* Filters & Search Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "40px", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ position: "relative", flexGrow: 1, maxWidth: "400px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search our collection..."
            value={search}
            onChange={handleSearch}
            className="form-input"
            style={{ paddingLeft: "40px", marginBottom: 0 }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SlidersHorizontal size={18} color="var(--text-muted)" />
          <select
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
            className="form-input"
            style={{ padding: "10px 16px", marginBottom: 0, width: "auto" }}
          >
            <option value="default">Default Sorting</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px", justifyContent: "center" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={selectedCategory === cat ? "btn btn-primary" : "btn btn-outline"}
            style={{ padding: "8px 20px", fontSize: "0.9rem" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "30px" }}>
        {filteredProducts.map((product) => (
          <div key={product._id} className="card-product">
            {product.image && (
              <img src={product.image} alt={product.name} />
            )}
            
            <div className="card-product-content">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h2 style={{ fontSize: "20px", margin: 0 }}>{product.name}</h2>
              </div>
              
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <span className="badge badge-stock">{product.category}</span>
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="badge badge-low-stock">Only {product.stock} left</span>
                )}
                {product.stock === 0 && (
                  <span className="badge" style={{ backgroundColor: "#f3f4f6", color: "#9ca3af", border: "1px solid #d1d5db" }}>Out of Stock</span>
                )}
              </div>

              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px", flexGrow: 1 }}>
                {product.description}
              </p>

              <h3 style={{ fontSize: "24px", color: "var(--color-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>₹{product.price}</span>
                {product.originalPrice && (
                  <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "16px", fontWeight: "400" }}>
                    ₹{product.originalPrice}
                  </span>
                )}
              </h3>

              <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                <button
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product._id)}
                  className="btn"
                  style={{
                    width: "100%",
                    backgroundColor: product.stock === 0 ? "#f3f4f6" : "var(--color-tertiary)",
                    color: product.stock === 0 ? "#9ca3af" : "var(--text-heading)",
                    cursor: product.stock === 0 ? "not-allowed" : "pointer"
                  }}
                >
                  <ShoppingCart size={18} /> {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
                </button>

                {product.stock > 0 && (
                  <button
                    onClick={() => shopNow(product._id)}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    <CreditCard size={18} /> Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;