import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("auth-change"));
      alert("Login Successful");
      if (res.data.user.usertype === "Admin") {
        navigate("/admin");
      } 
      else {
        navigate("/products");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="container" style={{ padding: "80px 20px", display: "flex", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: "450px", width: "100%", padding: "40px" }}>
        <h1 className="heading-section" style={{ fontSize: "32px", marginBottom: "30px", textAlign: "center" }}>Welcome Back</h1>
        
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "30px" }}>
          Sign in to access your Lumière Beauty account.
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: "30px" }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginBottom: "24px" }}>
            Login
          </button>

          <p style={{ textAlign: "center", margin: 0, color: "var(--text-main)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ fontWeight: "600", textDecoration: "underline" }}>
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Login;