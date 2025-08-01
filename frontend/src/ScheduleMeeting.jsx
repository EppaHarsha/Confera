import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "./utils/config";
const ScheduleMeeting = () => {
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Fetch meetings
  const fetchMeetings = () => {
    if (username) {
      axios
        .get(`${backendUrl}/user/${username}`)
        .then((res) => {
          setMeetings(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [username]);

  // Start meeting
  const handleStartMeeting = async (meetingId) => {
    try {
      const res = await axios.get(
        `${backendUrl}/scheduledMeetingStarted/${username}/${meetingId}`
      );
      console.log(res.data.message); // "Meeting deleted successfully"

      navigate("/preview", {
        state: {
          meetingId: meetingId,
          username: username,
        },
      });
    } catch (err) {
      console.log("Error occurred in scheduled meetings", err);
    }
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  return (
    <div className="container my-5">
      <h2>Scheduled Meetings for {username}</h2>
      {meetings.length === 0 ? (
        <p>No meetings scheduled.</p>
      ) : (
        <ul className="list-group">
          {meetings.map((meeting) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={meeting._id}
            >
              <div>
                <strong>{meeting.title}</strong> - {meeting.date} at{" "}
                {meeting.time} <br />
                <small>Meeting ID: {meeting.meetingId}</small>
              </div>
              <button
                className="btn btn-success"
                onClick={() => handleStartMeeting(meeting.meetingId)}
              >
                Start Meeting
              </button>
            </li>
          ))}
        </ul>
      )}
      <button className="btn btn-primary mt-3" onClick={handleBackToHome}>
        Back to Home
      </button>
    </div>
  );
};

export default ScheduleMeeting;
