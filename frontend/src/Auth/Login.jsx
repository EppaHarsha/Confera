import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:3000/login", {
      userEmail: userEmail,
      userPassword: userPassword,
    });
    const success = response.data.success;
    const userData = response.data.userData;
    console.log(userData);
    if (success) {
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userEmail", userData.userEmail);
      localStorage.setItem("userName", userData.userName);
      toast.success(response.data.message);
      navigate("/home");
    }
  
    if (!success) {
      toast.error(response.data.message, { position: "top-right" });
    }
  };
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-4 mt-5">
          <h1 className="text-muted" style={{ fontSize: "50px" }}>
            Welcome back
          </h1>
          <div>
            <h2 className="text-muted mt-4">Ready to reconnect?</h2>
            <h6 className="text-muted mt-4">
              Log in to access your meetings,messages and momens.
            </h6>
          </div>
          <form action="">
            <div className="mt-4">
              <label htmlFor="" className="form-label">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter your Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="" className="form-label">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="form-control"
              />
            </div>
            <p className="mt-3">
              If you don't have account go to <a href="/signup">Signup</a>
            </p>
            <button
              className="btn btn-primary fs-5 mt-1"
              onClick={handleSubmit}
            >
              Login
            </button>
          </form>
        </div>
        <div className="col-2"></div>
        <div className="col-6 mt-2">
          <img src="/images/Login.svg" alt="Login" style={{ width: "90%" }} />
        </div>
      </div>
    </div>
  );
}

export default Login;
