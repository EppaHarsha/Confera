import React from "react";
import "./Home.css";
function Home() {
  return (
    <>
      <nav className=" navbar-home navbar navbar-expand-lg navbar-light bg- shadow-sm px-4">
        <a className="navbar-brand fw-bold text-primary" href="#">
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

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active text-dark" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="#">
                Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark" href="#">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
  
    </>
  );
}

export default Home;
