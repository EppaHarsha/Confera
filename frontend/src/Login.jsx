import React from "react";
function Login() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-4 mt-5">
        <h1 className="text-muted">Login into Confera</h1>
          <form action="">
            <div className="mt-5">
              <label htmlFor="" className="form-label">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter your Email"
                name=""
                id=""
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
                className="form-control"
              />
            </div>
          </form>
        </div>
        <div className="col-2"></div>
        <div className="col-6 mt-3">
            <img src="/images/Login.svg" alt="Login" style={{width:"80%"}} />
        </div>
      </div>
    </div>
  );
}

export default Login;
