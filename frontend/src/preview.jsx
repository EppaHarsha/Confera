import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setMediaStream } from "./utils/stream.js";
function Preview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, meetingId } = location?.state || {};

  const localVideoRef = useRef(null);
  const myStreamRef = useRef(null);
  const [isCam, setIsCam] = useState(true);
  const [isMic, setIsMic] = useState(true);

  useEffect(() => {
    const getVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
         setMediaStream(stream);
        localVideoRef.current.srcObject = stream;
        myStreamRef.current = stream;
        await localVideoRef.current.play();
      }catch (error) {
      console.log("error");
    }
  }
    getVideo();
  }, []);

  const joinMeeting = (e) => {
    navigate("/joinMeet", {
      state: { userName: userName, meetingId: meetingId,isMic:isMic,isCam:isCam},
    });
  };
  console.log("Preview", userName);
  const toggleMic = () => {
    const audioTrack = myStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMic(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = myStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCam(videoTrack.enabled);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        textAlign: "center",
      }}
    >
      <h3 className="mt-3 text-center" style={{ color: " #0062cc" }}>
        Ready to Join
      </h3>
      <div className="container">
        <div className="row">
          <div className="col-4"></div>
          <div className="col-3">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                height: "500px",
                width: "500px",
                borderRadius: "10px",
              }}
            ></video>
          </div>
        </div>
      </div>

      <div style={{}}>
        <button
          onClick={toggleVideo}
          style={{
            backgroundColor: isCam ? "#dc3545" : "#28a745",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            margin: "0 0.5rem",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isCam ? "Turn Off Camera" : "Turn On Camera"}
        </button>

        <button
          onClick={toggleMic}
          style={{
            backgroundColor: isMic ? "#dc3545" : "#28a745",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            margin: "0 0.5rem",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isMic ? "Turn Off Mic" : "Turn On Mic"}
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={joinMeeting}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
}

export default Preview;
