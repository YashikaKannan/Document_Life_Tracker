import React, { useState, useContext, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import "../index.css";
import { UserContext } from "./UserContext";

function Tracker() {
  const { username, setUsername, userId, setUserId, documents, setDocuments } = useContext(UserContext);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(true);

  const navigate = useNavigate();

  // Redirect to Login if no user is logged in
  useEffect(() => {
    if (!userId) {
      navigate("/Login");
    }
  }, [userId, navigate]);

  // Fetch documents for current user
  useEffect(() => {
    if (!userId) {
      setLoadingDocs(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/documents/user/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            return []; // No docs yet
          }
          throw new Error("Failed to fetch documents");
        }
        return res.json();
      })
      .then((data) => {
        setDocuments(data);
        setLoadingDocs(false);
      })
      .catch((err) => {
        console.error("Error fetching documents:", err);
        setLoadingDocs(false);
      });
  }, [userId,username, setDocuments]);

  // Save new document
  const handleSave = () => {
    if (!selectedDoc || !expiryDate) {
      alert("Please select a document and expiry date.");
      return;
    }

    const newDoc = {
      user_id: userId,
      document_type: selectedDoc,
      expiry_date: expiryDate // YYYY-MM-DD format
    };

    fetch("http://127.0.0.1:8000/documents/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDoc)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save document");
        return res.json();
      })
      .then((savedDoc) => {
        setDocuments((prev) => [...prev, savedDoc]);
        setSelectedDoc("");
        setExpiryDate("");
        alert("Document saved successfully ✅");
      })
      .catch((err) => {
        console.error("Error saving document:", err);
        alert("Error: Could not save document");
      });
  };

  // Logout
  const handleLogout = () => {
    setUserId(null);
    setUsername("");
    setDocuments([]);
    navigate("/Login");
  };
   const handleSignup = () => {
    navigate("/Signup");
  };

  return (
    <>
      {/* Top Buttons */}
      <div className="logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="signup">
        <button onClick={handleSignup}>Signup</button>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="title">DOCUMENT LIFE TRACKER</div>
        <h1>Hello {username }</h1>

        {/* Add Document Form */}
        <select value={selectedDoc} onChange={(e) => setSelectedDoc(e.target.value)}>
          <option value="" disabled>Select Document Type</option>
          <option value="Aadhar Card">Aadhar Card</option>
          <option value="Vehicle Registration">Vehicle Registration</option>
          <option value="Passport">Passport</option>
          <option value="Driving License">Driving License</option>
          <option value="Vehicle Insurance">Vehicle Insurance</option>
          <option value="Income Certificate">Income Certificate</option>
          <option value="Other">Other</option>
        </select>

        <h1>Expiry Date</h1>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        <button onClick={handleSave}>SET & SAVE</button>

        {/* Documents List */}
        {loadingDocs ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p>No documents yet. Add one above.</p>
        ) : (
          <div className="grid">
            <div className="card">
              <strong>📁 DOCUMENTS</strong>
              {documents.map((doc) => (
                <div key={doc.doc_id}>{doc.document_type}</div>
              ))}
            </div>
            <div className="card">
              <strong>📅 DATE OF EXPIRY</strong>
              {documents.map((doc) => (
                <div key={doc.doc_id}>{doc.expiry_date}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Tracker;
