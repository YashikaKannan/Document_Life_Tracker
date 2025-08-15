import { useNavigate } from "react-router-dom";
import "../index.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

function Login() {
  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const { setUserId ,setUsername } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear fields on load
  useEffect(() => {
    setLocalUsername("");
    setLocalPassword("");
  }, []);
  

<<<<<<< HEAD
  const handleSubmit = async(e) => {
=======
  const handleSubmit = async (e) => {
>>>>>>> 4666202b0ab45bc2fac19746cccf889cab456f30
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

<<<<<<< HEAD
    // All good, navigate to tracker
    // navigate('/Tracker');
    
     try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        alert("Login successful!");
        navigate("/tracker"); // navigates only after success
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }

=======
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
>>>>>>> 4666202b0ab45bc2fac19746cccf889cab456f30
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
        <input
          type="password"
          placeholder="PASSWORD"
          value={localPassword}
          onChange={(e) => setLocalPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
    </div>
    </>
  );
}

export default Login;