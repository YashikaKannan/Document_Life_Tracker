import { useNavigate } from "react-router-dom";
import "../index.css";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

function Signup() {
  const {
    username, setUsername,
    password, setPassword,
    email, setEmail,
    confirmPassword, setConfirmPassword,
    passwordMismatch, setPasswordMismatch,
    mobilenumber, setMobileNumber,
    setUserId
  } = useContext(UserContext);
  const handleLogout = () => {
    navigate("/Login");
  };

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword || !email || !mobilenumber) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const res = await axios.post(`${API_URL}/users`, {
        name: username,
        mobile_number: mobilenumber,
        email: email,
        password: password
      });

      if ((res.status === 200 || res.status === 201) && res.data?.user_id) {
        setUserId(res.data.user_id); // store new user in context
        alert("Account created successfully!");
        navigate("/Tracker");
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Signup failed. Try again.");
    }
  };


  return (
    <>
    <div className="logout">
        <button onClick={handleLogout}>Login</button>
      </div>
    <div className="container">
      <div className="title">DOCUMENT LIFE TRACKER</div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="User Name" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Mobile Number" value={mobilenumber} onChange={(e) => setMobileNumber(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ padding: "6px 10px" }}>{showPassword ? "Hide" : "Show"}</button>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} style={{ padding: "6px 10px" }}>{showConfirmPassword ? "Hide" : "Show"}</button>
        </div>
        {passwordMismatch && <p style={{ color: "red" }}>Passwords do not match</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
    </>
  );
}

export default Signup;