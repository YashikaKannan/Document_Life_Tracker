import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
function Login() {

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    console.log('login Info:',{username, email, password});
  }
    return(
    <div>
    <div className="container">
      <div className="title">DOCUMENT LIFE TRACKER</div>
      <div className="section-title">LOGIN</div>
      <input type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="USER NAME" />

      <input type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
       id = "email"placeholder="EMAIL" />


      <input type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
       id="password"placeholder="PASSWORD" />
      <Link to="/Tracker">
        <button type="button"
        onClick={handleLogin}>Submit</button>
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