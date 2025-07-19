import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
 import { getMediaStream } from "./utils/stream";
function MeetingPage() {

    const location = useLocation()
    const {userName,meetingId}=location.state||{};
    const localVideoRef = useRef(null);

    useEffect(()=>{
         const stream = getMediaStream();
         console.log("meeting page " ,stream);
          localVideoRef.current.srcObject=stream;
        console.log("meetingPage",userName)
    },[]);
  return (
    <>
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
    </>
  );
}

export default MeetingPage;
