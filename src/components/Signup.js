import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

function Signup() {
    return (
        <div className="container">
      <div className="title">DOCUMENT LIFE TRACKER</div>
      <div className="section-title">SIGN UP</div>
      <input type="text" placeholder="USER NAME" />
      <input type="password" placeholder="PASSWORD" />
      <input type="password" placeholder="CONFIRM PASSWORD" />
      <Link to="/tracker">
        <button type="button">Submit</button>
      </Link>
      <div>
        <Link to="/ForgotPassword">
          <button type="button">Forgot Password</button>
        </Link>
      </div>
    </div>
    );
}
export default Signup;
