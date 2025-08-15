import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Tracker from "./components/Tracker";
import { UserProvider } from "./components/UserContext"; // path should be correct

function App() {
  return (
    <UserProvider>
<<<<<<< HEAD
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Tracker" element={<Tracker />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <div className="App">
      <h1>Document Life Tracker</h1>
        <AddDocumentForm />

      <DocumentList />
    </div>
        </Routes>
      </Router>
=======
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />       {/* Default page */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Tracker" element={<Tracker />} />
      </Routes>
    </Router>
>>>>>>> 4666202b0ab45bc2fac19746cccf889cab456f30
    </UserProvider>
     
  );
}

export default App;
