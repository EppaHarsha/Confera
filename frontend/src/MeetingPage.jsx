import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getMediaStream } from "./utils/stream";
import Chat from './Chat'
function MeetingPage() {
  const location = useLocation();
  const { userName, meetingId } = location.state || {};
  const localVideoRef = useRef(null);

  useEffect(() => {
    const stream = getMediaStream();
    console.log("meeting page ", stream);
    localVideoRef.current.srcObject = stream;
    console.log("meetingPage", userName);
  }, []);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <h1>Heelo</h1>
            <h2>{userName}</h2>
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
          <div className="col-6">
              <Chat userName={userName} meetingId={meetingId}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default MeetingPage;
