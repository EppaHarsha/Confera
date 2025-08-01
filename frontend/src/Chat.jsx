import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import SendIcon from '@mui/icons-material/Send';
import './Chat.css';
import { backendUrl } from "./utils/config";
const socket = io(backendUrl);

function Chat({ userName, meetingId }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit("join-meeting", { meetingId });
  }, [meetingId]);

  useEffect(() => {
    socket.on("server-msg", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("server-msg");
    };
  }, []);

  const sentMsg = () => {
    if (message.trim() !== "") {
      socket.emit("client-msg", {
        message,
        userName,
        meetingId,
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chat.map((msg, i) => (
          <p key={i}>
            <strong>{msg.userName}</strong>: {msg.message}
          </p>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-primary" onClick={sentMsg}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default Chat;
