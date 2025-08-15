import { useNavigate } from "react-router-dom";
import "../index.css";
import { useContext } from "react";
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
<<<<<<< HEAD
    // navigate("/tracker");
    
    // Connecting to fastapi
    try{
      const response=await fetch("http://localhost:8000/users/",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name: username,
          mobile_number: mobilenumber,
          email: email,
          password_hash: password
        })
      });
    if(response.ok){
      const data=await response.json();
      console.log("Signup Successful", data);
      alert("Signup Successful");
      navigate("/tracker");
    }
    else{
      const errorData = await response.json();
      alert(errorData.detail || "Signup failed");
    }
  }
    catch(error){
      console.error("Error during signup", error);
      alert("An error occured, please try again");
=======

    try {
      const res = await axios.post("http://127.0.0.1:8000/users/", {
        name: username,
        mobile_number: mobilenumber,
        email: email,
        password_hash: password
      });

      if ((res.status === 200 || res.status === 201) && res.data?.user_id) {
        setUserId(res.data.user_id); // store new user in context
        alert("Account created successfully!");
        navigate("/Tracker");
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Signup failed. Try again.");
>>>>>>> 4666202b0ab45bc2fac19746cccf889cab456f30
    }
  };


  return (
    <>
    <div className="logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    <div className="container">
      <div className="title">DOCUMENT LIFE TRACKER</div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="User Name" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Mobile Number" value={mobilenumber} onChange={(e) => setMobileNumber(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {passwordMismatch && <p style={{ color: "red" }}>Passwords do not match</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
    </>
  );
}

export default Signup;
