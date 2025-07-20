// import React, { useEffect, useState, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { getMediaStream } from "./utils/stream";
// import Chat from "./Chat";
// import Video from "./Video";
// function MeetingPage() {
//   const location = useLocation();
//   const {
//     userName,
//     meetingId,
//     isMic = true,
//     isCam = true,
//   } = location.state || {};
//   return (
//     <>
//       <div className="container">
//         <div className="row">
//           <div className="col-6">
//             <Video />
//           </div>
//           <div className="col-6">
//             <Chat userName={userName} meetingId={meetingId} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default MeetingPage;
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Video from "./Video";
import Chat from "./Chat";
import "./Meeting.css"; // We'll define styles here
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MicOffIcon from '@mui/icons-material/MicOff';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
function MeetingPage() {
  const location = useLocation();
  const {
    userName,
    meetingId,
    isMic = true,
    isCam = true,
  } = location.state || {};
  const [showChat, setShowChat] = useState(false);
  const [onCam, setOnCam] = useState(isCam);
  const [onMic, setOnMic] = useState(isMic);
  const toggleVideo = () => setOnCam((prev) => !prev);
  const toggleMic = () => setOnMic((prev) => !prev);

  return (
    <div className="meeting-page">
      <div className="container">
        <div className="row">
          <div className="col-6">
            <Video onCam={onCam} onMic={onMic} />
          </div>
          <div className="col-3"></div>
          <div className="col-3">
            {showChat && <Chat userName={userName} meetingId={meetingId} />}
          </div>
        </div>
      </div>
      <div className="footer-controls ">
        <div className="control-btns" style={{ marginLeft: "600px" }}>
          <button style={{color:"white"}} className="btn" onClick={toggleVideo}>
            {onCam ? <VideocamIcon/> : <VideocamOffIcon/>}
          </button>
          <button style={{color:"white"}} className="btn" onClick={toggleMic}>
            {onMic ? <MicIcon/> :<MicOffIcon/>} 
          </button>
          <button style={{color:"white"}}
            className="btn"
            onClick={() => setShowChat(!showChat)}
          >
            <ChatBubbleIcon/>
          </button>
          <button style={{color:"white"}} className="btn"><PeopleIcon/></button>
          <button style={{color:"white"}} className="btn"><LogoutIcon/></button>
        </div>
      </div>
    </div>
  );
}

export default MeetingPage;
