import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    if (!passwordPattern.test(password)) {
      alert("Password must be at least 8 characters long, include at least 1 letter and 1 special symbol(@,!,#,*,%,^).");
      return;
    }
    navigate('/Tracker');
  };

  return (
    <div>
      <form className="container" onSubmit={handleSubmit}>
        <div className="title">DOCUMENT LIFE TRACKER</div>
        <div className="section-title">LOGIN</div>

        <input
          type="text"
          placeholder="USER NAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>

      <div className="logout">
        <Link to="/Signup">
          <button type="button">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
