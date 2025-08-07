import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

function Tracker() {
    return(
        <>
      <div className="logout">
        <Link to="/">
          <button>Logout</button>
        </Link>
      </div>
      <div className="container">
        <div className="title">DOCUMENT LIFE TRACKER</div>
        <select defaultValue="">
          <option value="" disabled>Select Document Type</option>
          <option value="Aadhar Card">Aadhar Card</option>
          <option value="Vehicle Registration">Vehicle Registration</option>
          <option value="Passport">Passport</option>
          <option value="Driving License">Driving License</option>
          <option value="Vehicle Insurance">Vehicle Insurance</option>
          <option value="Income Certificate">Income Certificate</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" />
        <button>SET & SAVE</button>
        <div className="grid">
          <div className="card">
            <strong>📁 DOCUMENTS</strong>
          </div>
          <div className="card">
            <strong>📅 DATE OF EXPIRY</strong>
          </div>
        </div>
      </div>
    </>
    );
}
export default Tracker;
