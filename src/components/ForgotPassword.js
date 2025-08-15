import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

function ForgotPassword() {
  return (
    <div className="container">
      <div className="title">DOCUMENT LIFE TRACKER</div>
      <div className="section-title">FORGOT PASSWORD</div>

      <input type="email" placeholder="Enter your registered email/ Mobile number" />
      <button type="button">Send Reset Link</button>

      <div style={{ marginTop: '20px' }}>
        <Link to="/Login">
          <button type="button">Back to Login</button>
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;