import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Navbar";
import LandingPage from "./Landingpg/LandingPage";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Home from "./Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="colored"
        />
      </Router>
    </>
  );
}

export default App;
