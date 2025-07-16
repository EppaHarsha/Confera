import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Signup() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:3000/signup", {
      userName: userName,
      userEmail: userEmail,
      userPassword: userPassword,
    });
    // console.log(success);
    const success = response.data.success;
    const userData = response.data.userData;
    console.log(userData);
    if (success) {
      toast.success(response.data.message);
      localStorage.setItem("userName", userData.userName);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userEmail", userData.userEmail);
      navigate("/home");
    }
  
    if (!success) {
      toast.error(response.data.message,{position:"top-right"});
    }
  };

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-4 ">
          <h1 className="text-muted " style={{ fontSize: "50px" }}>
            New here?
          </h1>
          <div>
            <h2 className="text-muted mt-4">Let's get you connected.</h2>
            <h6 className="text-muted mt-4">
              Create your account and start your journey with confera.
            </h6>
          </div>
          <form action="">
            <div className="mt-4">
              <label htmlFor="" className="form-label">
                UserName
              </label>
              <input
                type="text"
                placeholder="Enter your UserName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mt-2">
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
            <div className="mt-2 mb-5">
              <label htmlFor="" className="form-label">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="form-control"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary fs-5" onClick={handleSubmit}>
              SignUp
            </button>
          </form>
        </div>
        <div className="col-2"></div>
        <div className="col-6 mt-2">
          <img src="/images/singup1.svg" alt="Login" style={{ width: "75%" }} />
        </div>
      </div>
    </div>
  );
}

export default Signup;
