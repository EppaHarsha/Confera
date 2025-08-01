import React, { useState } from "react";
import "../Home.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
function Home() {
  const [username, setusername] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [scheduledTitle, setScheduledTitle] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledMeetings, setScheduledMeetings] = useState([]);

  const navigate = useNavigate();

  const handlePreviewJoin = async (e) => {
    e.preventDefault();

    const modal = document.getElementById("joinModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) modalInstance.hide();

    if (!username || !meetingId) {
      toast.error("Please enter both Meeting ID and Name.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/meeting-exists/${meetingId}`
      );

      if (response.data.exists) {
        // Valid meeting, go to preview
        navigate("/preview", {
          state: { username: username, meetingId: meetingId },
        });
      } else {
        toast.error("No active meeting found with this ID.");
      }
    } catch (error) {
      console.error("Error checking meeting ID:", error);
      toast.error("Could not check meeting. Please try again.");
    }
  };

  // const handlePreviewJoin = async (e) => {
  //   e.preventDefault();

  //   const modal = document.getElementById("joinModal");
  //   const modalInstance = bootstrap.Modal.getInstance(modal);
  //   if (modalInstance) {
  //     modalInstance.hide();
  //   }

  //   console.log("Home", username);
  //   console.log("Home", meetingId);
  //   if (username && meetingId) {
  //     // toast.success("Ready to join!");
  //     // setTimeout(() => {
  //     navigate("/preview", {
  //       state: { username: username, meetingId: meetingId },
  //     });
  //     // }, 500);
  //   } else if (username === undefined && meetingId) {
  //     toast.error("Missing username");
  //   } else {
  //     toast.error("Missing meetingId");
  //   }
  // };

  const hostMeeting = (e) => {
    e.preventDefault();

    const modal = document.getElementById("hostModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
    const id = uuidv4();
    setMeetingId(id);
    console.log("This is meeting id", meetingId);
    console.log("This is username from create meeting handler", username);
    if (username && id) {
      // toast.success("Ready to join!");
      // setTimeout(() => {
      navigate("/preview", {
        state: { username: username, meetingId: id},
      });
      // }, 500);
    } else if (username === undefined && id) {
      toast.error("Missing username");
    } else {
      toast.error("Missing meetingId");
    }
  };

  // const handleScheduleMeeting = (e) => {
  //   e.preventDefault();

  //   const modal = document.getElementById("scheduleModal");
  //   const modalInstance = bootstrap.Modal.getInstance(modal);
  //   if (modalInstance) modalInstance.hide();

  //   if (!username) {
  //     toast.error("Please enter your name first.");
  //     return;
  //   }

  //   if (!scheduledTitle || !scheduledDate || !scheduledTime) {
  //     toast.error("Please fill all schedule fields.");
  //     return;
  //   }

  //   const id = uuidv4();

  //   const meeting = {
  //     meetingId: id,
  //     username,
  //     topic: scheduledTitle,
  //     date: scheduledDate,
  //     time: scheduledTime,
  //   };

  //   // Store it in state
  //   setScheduledMeetings((prev) => [...prev, meeting]);

  //   // Optionally store in localStorage (persistence)
  //   const existing =
  //     JSON.parse(localStorage.getItem("scheduledMeetings")) || [];
  //   existing.push(meeting);
  //   localStorage.setItem("scheduledMeetings", JSON.stringify(existing));

  //   // Navigate with just the newly scheduled meeting
  //   navigate("/schedule-meeting", {
  //     state: { meetingDetails: meeting },
  //   });
  // };

  const handleScheduleMeeting = async (e) => {
  e.preventDefault();

  const modal = document.getElementById("scheduleModal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  if (modalInstance) modalInstance.hide();

  if (!username) {
    toast.error("Please enter your name first.");
    return;
  }

  if (!scheduledTitle || !scheduledDate || !scheduledTime) {
    toast.error("Please fill all schedule fields.");
    return;
  }

  const id = uuidv4();
  setusername(localStorage.getItem("username"));
  // console.log(localStorage.getItem("username"));
  console.log(username);
  try {
    await axios.post("http://localhost:3000/schedule", {
      username:localStorage.getItem("username"),
      meetingId: id,
      title: scheduledTitle,
      date: scheduledDate,
      time: scheduledTime,
    });

    toast.success("Meeting scheduled!");

    // Go to schedule page with this meeting
    navigate("/schedule-meeting", {
      state: { username },
    });
  } catch (error) {
    toast.error("Error scheduling meeting.");
    console.error(error);
  }
};

  return (
    <>
      {/* Top Section */}
      <div className="container my-5 py-5">
        <div className="row align-items-center" style={{ marginTop: "-80px" }}>
          <div className="col-md-6 text-center text-md-start">
            <h4 className="fw display-6">Connect. Collaborate. Confera.</h4>
            <p className="text-muted fs-5 mt-1">
              Host meetings, join meetings, or collaborate instantly — all in one
              place.
            </p>
            <button className="btn btn-primary mt-4 px-4 py-2">
              Get Started
            </button>
            <br />
            {/* <a href="/schedule-meeting" style={{textDecoration:"none"}}>
              <button className="btn btn-primary mt-2">scheduled meetings</button>
            </a> */}
          </div>

          <div className="col-md-6 text-center mt-4 mt-md-0 home-img">
            <img
              src="/images/homepage.svg "
              alt="Team Communication"
              className="img-fluid"
              style={{ maxHeight: "350px" }}
            />
          </div>
        </div>
      </div>

      {/* Card Section */}
      <div className="container">
        <div className="row">
          {[
            {
              title: "Create a Meeting",
              text: "Start a meeting  with a single click. No downloads.",
              target: "hostModal",
              button: "Host",
            },
            {
              title: "Join a meeting",
              text: "Enter a meeting ID and join your team or class instantly.",
              target: "joinModal",
              button: "Join",
            },
            {
              title: "Schedule  Meeting",
              text: "Plan your meetings ahead and send invites instantly.",
              target: "scheduleModal",
              button: "Schedule",
            },

            {
              title:  "Scheduled Meetings",
              text: "This section lists all your upcoming meetings. You can start or review them here anytime.",
              target: "recordModal",
              button:"View Scheduled Meetings"
            },
          ].map((card, index) => (
            <div className="col-sm-3" key={index}>
              <div className="card p-3 h-100">
                <div
                  className="card-body d-flex flex-column justify-content-between"
                  style={{ height: "230px" }}
                >
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
                  <label className="form-label">Host Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Host Name"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Meeting Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Team Sync Meeting"
                    value={scheduledTitle}
                    onChange={(e) => setScheduledTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleScheduleMeeting}
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

   
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
                <h5 className="modal-title">Join a meeting</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">meeting ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter room ID"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
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
                <button className="btn btn-primary" onClick={handlePreviewJoin}>
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

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
                <h5 className="modal-title">Start a meeting</h5>
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
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                  />
                </div>
                <button
                  style={{ width: "100%" }}
                  type="submit"
                  className="btn btn-primary"
                  onClick={hostMeeting}
                >
                  Start meeting
                </button>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="recordModal"
        tabIndex="-1"
        aria-labelledby="recordModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={()=>navigate("/schedule-meeting")}>
              <div className="modal-header">
                <h5 className="modal-title">Go to scheduled Meeting page</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <button className="btn btn-primary mt-2">scheduled meetings</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
