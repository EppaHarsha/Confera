import React, { useState } from "react";
import "./Home.css";

function Home() {
  return (
    <>
      {/* Top Section */}
      <div className="container my-5 py-5">
        <div className="row align-items-center mb-4" style={{ marginTop: "-60px" }}>
          <div className="col-md-6 text-center text-md-start">
            <h4 className="fw display-6">Connect. Collaborate. Confera.</h4>
            <p className="text-muted fs-5 mt-1">
              Host meetings, join rooms, or collaborate instantly — all in one
              place.
            </p>
            <button className="btn btn-primary mt-4 px-4 py-2">
              Get Started
            </button>
          </div>

          <div className="col-md-6 text-center mt-4 mt-md-0">
            <img
              src="/images/team_communication.svg"
              alt="Team Communication"
              className="img-fluid"
              style={{ maxHeight: "350px" }}
            />
          </div>
        </div>
      </div>

      {/* Card Section */}
      <div className="container mt-5">
        <div className="row mt-4">
          {[
            {
              title: "Schedule  Meeting",
              text: "Plan your meetings ahead and send invites instantly.",
              target: "scheduleModal",
              button: "Schedule",
            },
            {
              title: "Join a Room",
              text: "Enter a room ID and join your team or class instantly.",
              target: "joinModal",
              button: "Join",
            },
            {
              title: "Host a Call",
              text: "Start a video call with a single click. No downloads.",
              target: "hostModal",
              button: "Host",
            },
            {
              title: "Record Sessions",
              text: "Save your meetings for future reference or sharing.",
              target: "recordModal",
              button: "Record",
            },
          ].map((card, index) => (
            <div className="col-sm-3 mb-4" key={index}>
              <div className="card p-3 h-100" >
                <div className="card-body d-flex flex-column justify-content-between" style={{height:"230px"}}>
                  <div className="pt-3">
                    <h4 className="card-title">{card.title}</h4>
                    <p className="card-text mt-4">{card.text}</p>
                  </div>
                  <button
                    className="btn btn-primary mt-3"
                    data-bs-toggle="modal"
                    data-bs-target={`#${card.target}`}
                  >
                    {card.button}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      <div
        className="modal fade"
        id="scheduleModal"
        tabIndex="-1"
        aria-labelledby="scheduleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title">Schedule a Meeting</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Meeting Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Team Sync Meeting"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input type="time" className="form-control" />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      <div
        className="modal fade"
        id="joinModal"
        tabIndex="-1"
        aria-labelledby="joinModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title">Join a Room</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Room ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter room ID"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Host Modal */}
      <div
        className="modal fade"
        id="hostModal"
        tabIndex="-1"
        aria-labelledby="hostModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title">Host a Call</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Host Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Start Call
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Record Modal */}
      <div
        className="modal fade"
        id="recordModal"
        tabIndex="-1"
        aria-labelledby="recordModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title">Record Session</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Session Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Team Weekly Review"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Save Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., /recordings/"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Start Recording
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
