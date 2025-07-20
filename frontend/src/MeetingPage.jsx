import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getMediaStream } from "./utils/stream";
import Chat from "./Chat";
import Video from "./Video";
function MeetingPage() {
  const location = useLocation();
  const {
    userName,
    meetingId,
    isMic = true,
    isCam = true,
  } = location.state || {};
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <Video />
          </div>
          <div className="col-6">
            <Chat userName={userName} meetingId={meetingId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default MeetingPage;
