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
        <input type="text" placeholder="DOCUMENT NAME" />
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