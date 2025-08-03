import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "./utils/config";
function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setusername] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    console.log(username);
    setusername(username);
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);
  function logout() {
    localStorage.clear();
    localStorage.setItem("logoutToast", "true");
    window.location.href = "/";
  }
  const hideNavabar = ["/preview", "/joinMeet"];
  const location = useLocation();
  if (hideNavabar.includes(location.pathname)) {
    return null;
  }
  return (
    <nav className=" navbar-home navbar navbar-expand-lg navbar-light bg- shadow-sm px-4">
      <Link
        className="navbar-brand fw-bold text-primary fs-4"
        to={!isLoggedIn ? "/" : "/home"}
      >
        Confera
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link active text-dark fs-5" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
               <Link className="nav-link active text-dark fs-5" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fs-5" to="/signup">
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item d-flex align-items-center">
                <span className="nav text-primary fs-5">Hi, {username}</span>
              </li>
              <li className="nav-item">
                <button className="btn fs-5 nav-link" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
