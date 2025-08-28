import { useNavigate } from "react-router-dom";
import "../index.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

function Login() {
  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const { setUserId ,setUsername, setPassword, setMobileNumber ,setConfirmPassword, setEmail} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Clear fields on load
  useEffect(() => {
    setLocalUsername("");
    setLocalPassword("");
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localUsername || !localPassword) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        username: localUsername,
        password: localPassword
      });

      if (res.data && res.data.user_id&&res.data.name) {
    setUserId(res.data.user_id);        // store ID
    setUsername(res.data.name);       // store username from API
    navigate("/Tracker");               // go to Tracker
    return;
}

      alert("Unexpected server response. Please try again.");
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSignup = () => {
    navigate("/Signup");
    setPassword("");
    setMobileNumber("");
    setConfirmPassword("");
    setEmail("");
  };

  return (
    <>
    <div className="logout">
        <button onClick={handleSignup}>Signup</button>
      </div>
    <div className="container">
      <div className="title">DOCUMENT LIFE TRACKER</div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="USER NAME"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
        />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="PASSWORD"
            value={localPassword}
            onChange={(e) => setLocalPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{ padding: "6px 10px" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
    </div>
    </>
  );
}

export default Login;