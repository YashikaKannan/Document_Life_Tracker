import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
function Login() {
    return(
    <div>
    <div className="container">
      <div className="title">DOCUMENT LIFE TRACKER</div>
      <div className="section-title">LOGIN</div>
      <input type="text" placeholder="USER NAME" />
      <input type="email" placeholder="EMAIL" />
      <input type="password" placeholder="PASSWORD" />
      <Link to="/Tracker">
        <button type="button">Submit</button>
      </Link> 
    </div>
    <div className="logout">
        <Link to="/Signup">
          <button type="button">Sign Up</button>
        </Link>
    </div>
    </div>
  );
}
export default Login;