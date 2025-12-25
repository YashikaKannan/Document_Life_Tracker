import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { UserContext } from "./UserContext";

function Tracker() {
  const { username, setUsername, userId, setUserId, documents, setDocuments } =
    useContext(UserContext);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(true);

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!userId) {
      navigate("/Login");
    }
  }, [userId, navigate]);
  // Set min selectable date to tomorrow (future-only)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);


  // Fetch user documents
  useEffect(() => {
    if (!userId) {
      setLoadingDocs(false);
      return;
    }

   fetch(`https://document-life-tracker-5hpc.onrender.com/documents/user/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) return [];
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
  }, [userId, setDocuments]);

  // Save new document
  const handleSave = () => {
    if (!selectedDoc || !expiryDate) {
      alert("Please select a document and expiry date.");
      return;
    }

    if (expiryDate < minDate) {
      alert("Please choose a future date (not today or past).");
      return;
    }

    const newDoc = {
      user_id: userId,
      document_type: selectedDoc,
      expiry_date: expiryDate,
    };

    fetch("https://document-life-tracker-5hpc.onrender.com/documents",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newDoc),
  }
)

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

  // Delete document
  const handleDelete = (docId) => {
    fetch(`https://document-life-tracker-5hpc.onrender.com/documents/${docId}`,
    {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete");
        setDocuments((prev) => prev.filter((doc) => doc.doc_id !== docId));
      })
      .catch((err) => {
        console.error("Error deleting document:", err);
        alert("Error: Could not delete document");
      });
  };

  // Logout
  const handleLogout = () => {
    setUserId(null);
    setUsername("");
    setDocuments([]);
    navigate("/Login");
  };

  return (
    <>
      {/* Logout Button */}
      <div className="logout">
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="container">
        <div className="title" style={{color: "rgb(0, 0, 128)"}}>DOCUMENT LIFE TRACKER</div>
        <h1>Hello {username}</h1>

        {/* Add Document Form */}
        <select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
        >
          <option value="" disabled>
            Select Document Type
          </option>
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
          min={minDate}
        />

        <button onClick={handleSave}>SET & SAVE</button>

        {/* Document List */}
        {loadingDocs ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p>No documents yet. Add one above.</p>
        ) : (
          <div className="grid" style={{display: "flex", flexDirection: "column", gap: "10px", width: "100%"}}>  
          {documents.map((doc) => (
              <div
                key={doc.doc_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  width: "100%"             
                }}>
                <span style={{whiteSpace: "nowrap"}}>
                  {doc.document_type} - {doc.expiry_date}
                </span>
                <button
                  onClick={() => handleDelete(doc.doc_id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 0",
                    width: "80px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Tracker;