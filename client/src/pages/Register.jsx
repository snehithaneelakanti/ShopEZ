import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/register",
        formData
      );

      alert("Registration Successful");

setFormData({
  username: "",
  email: "",
  password: "",
  address: "",
  phone: "",
});

navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="container" style={{ padding: "80px 20px", display: "flex", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: "500px", width: "100%", padding: "40px" }}>
        <h1 className="heading-section" style={{ fontSize: "32px", marginBottom: "30px", textAlign: "center" }}>Create Account</h1>
        
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "30px" }}>
          Join Rose and Roots to discover premium beauty tailored to you.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="text"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "30px" }}>
            <label className="form-label">Address (Optional)</label>
            <input
              type="text"
              name="address"
              placeholder="Your delivery address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "16px", marginBottom: "24px" }}>
            Register
          </button>

          <p style={{ textAlign: "center", margin: 0, color: "var(--text-main)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: "600", textDecoration: "underline" }}>
              Login Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;