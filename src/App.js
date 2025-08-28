import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Tracker from "./components/Tracker";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />       {/* Default page */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Tracker" element={<Tracker />} />
      </Routes>
    </Router>
     
  );
}

export default App;