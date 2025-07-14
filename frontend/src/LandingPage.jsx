import React, { useEffect } from "react";
import Navbar from "./Navbar";
import {useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
  useEffect(()=>{
    const logoutToast=localStorage.getItem("logoutToast");
    if(logoutToast==="true"){
      toast.info("Logged Out");
      localStorage.removeItem("logoutToast");
    }
  },[])
  return (
    <>
      <div className="container mt-5 mb-4">
        <div className="row">
          <div className="col-6 mt-5 text-muted">
            <div className="mt-5 mb-5">
              <h1 style={{ lineHeight: "1.5", fontSize: "50px" }}>
                {" "}
                Where conversations come alive, even from afar.
              </h1>
            </div>
            <div className="mt-5">
              <Link className="nav-link text-dark fs-5" to="/login">
                <button className="btn btn-primary fs-4 home-btn">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
          <div className="col-1"></div>
          <div className="col-5 p-5">
            <img
              src="/images/Home.svg"
              alt="Logo"
              style={{ width: "95%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
