import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setMediaStream } from "./utils/stream.js";

function Preview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, meetingId } = location?.state || {};
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
      } catch (error) {
        console.log("error");
      }
    };
    getVideo();
  }, []);

  const joinMeeting = () => {
    navigate("/joinMeet", {
      state: { username, meetingId, isMic, isCam },
    });
  };

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
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h3 className="mt-3 text-center" style={{ color: "#0062cc" }}>
        Ready to Join
      </h3>

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="video-container">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "auto",
                  borderRadius: "10px",
                  backgroundColor: "#000",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
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

      <div className="mt-4">
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
