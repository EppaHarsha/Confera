import React from "react";
import "./Home.css";
function navbar() {
  return (
    <nav className=" navbar-home navbar navbar-expand-lg navbar-light bg- shadow-sm px-4">
      <a className="navbar-brand fw-bold text-primary fs-4" href="/">
        Confera
      </a>
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
          <li className="nav-item">
            <a className="nav-link active text-dark fs-5" href="#">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark fs-5" href="#">
              Login
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-dark fs-5" href="#">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default navbar;
