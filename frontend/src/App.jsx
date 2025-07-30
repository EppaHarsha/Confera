import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Navbar";
import LandingPage from "./Landingpg/LandingPage";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Home from "./Home/Home";
import Preview from "./preview";
import MeetingPage from "./MeetingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScheduleMeeting from "./ScheduleMeeting";

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
          <Route path="/preview" element={<Preview/>}/>
          <Route path="/joinMeet" element={<MeetingPage/>}/>
          <Route path="/schedule-meeting" element={<ScheduleMeeting/>}/>

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
