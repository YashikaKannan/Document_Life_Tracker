import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    if (!passwordPattern.test(password)) {
      alert(
        "Password must be at least 8 characters long, include at least 1 letter and 1 special symbol(@,!,#,*,%,^)."
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    navigate("/tracker");
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="title">DOCUMENT LIFE TRACKER</div>
      <div className="section-title">SIGN UP</div>

      <input
        type="text"
        placeholder="USER NAME"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "16px",
            color: "gray"
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      {passwordMismatch && (
        <div style={{ color: "red", marginBottom: "5px" }}>
          Password dosen't match
        </div>
      )}

      <div style={{ position: "relative" }}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="CONFIRM PASSWORD"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (password !== e.target.value) {
              setPasswordMismatch(true);
            } else {
              setPasswordMismatch(false);
            }
          }}
        />
        <span
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "16px",
            color: "gray"
          }}
        >
          {showConfirmPassword ? "🙈" : "👁️"}
        </span>
      </div>

      <button type="submit">Submit</button>

      <div>
        <Link to="/ForgotPassword">
          <button type="button">Forgot Password</button>
        </Link>
      </div>
    </form>
  );
}

export default Signup;
