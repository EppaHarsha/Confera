import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import "./Meeting.css";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
const socket = io("http://localhost:3000");

export default function MeetingPage() {
  const { state } = useLocation();
  const { username, meetingId, isMic, isCam } = state;
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mySocketId, setMySocketId] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [participantOpen, setParticipantOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isHost, setIsHost] = useState(false);
  const userVideo = useRef();
  const streamRef = useRef();
  const peersRef = useRef([]);
  useEffect(() => {
    socket.on("host-confirmation", ({ isHost }) => {
      setIsHost(isHost);
      console.log("Am I host?", isHost);
    });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // 🟢 Listen when server sends "meeting-ended"
    socket.on("meeting-ended", () => {
      toast.info("Meeting has been ended by Host!");
      navigate("/home"); // redirect to home page or any other page
    });

    return () => {
      socket.off("meeting-ended"); // ✅ cleanup listener
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setMySocketId(socket.id);
      socket.emit("join-meeting", { meetingId });
    });

    const handleServerMsg = ({ username: sender, message }) => {
      setMessages((prev) => [...prev, { sender, text: message }]);
    };
    socket.on("server-msg", handleServerMsg);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        streamRef.current = stream;

        socket.emit("join-room", { meetingId, username });

        socket.on("all-users", (users) => {
          users.forEach(({ userId, username: otherUsername }) => {
            const peer = createPeer(userId, socket.id, stream);
            const peerObj = { peerID: userId, peer, username: otherUsername };

            peersRef.current.push(peerObj);

            peer.on("stream", (remoteStream) => {
              setPeers((prev) => [
                ...prev,
                { ...peerObj, stream: remoteStream },
              ]);
            });
          });
        });

        socket.on("user-joined", ({ userId, username: newUsername }) => {
          const peer = addPeer(userId, stream);
          const peerObj = { peerID: userId, peer, username: newUsername };

          peersRef.current.push(peerObj);

          peer.on("stream", (remoteStream) => {
            setPeers((prev) => [...prev, { ...peerObj, stream: remoteStream }]);
          });
        });

        socket.on("signal", ({ from, signal }) => {
          const item = peersRef.current.find((p) => p.peerID === from);
          if (item) item.peer.signal(signal);
        });

        socket.on("user-left", ({ userId }) => {
          peersRef.current = peersRef.current.filter(
            (p) => p.peerID !== userId
          );
          setPeers((prev) => prev.filter((p) => p.peerID !== userId));
        });
      });

    return () => {
      socket.off("server-msg", handleServerMsg);
      socket.disconnect();
    };
  }, []);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (signal) => {
      socket.emit("signal", { to: userToSignal, from: callerID, signal });
    });
    return peer;
  };

  const addPeer = (incomingSignalUserId, stream) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (signal) => {
      socket.emit("signal", {
        to: incomingSignalUserId,
        from: socket.id,
        signal,
      });
    });
    return peer;
  };

  const toggleVideo = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  const toggleChat = () => {
    setParticipantOpen(false);
    setChatOpen((prev) => !prev);
  };
  const toggleParticipant = () => {
    setChatOpen(false);
    setParticipantOpen((prev) => !prev);
  };
  const endCall = () => {
    navigate("/home");
  };
  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("client-msg", {
        message: newMessage,
        username,
        meetingId,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="video-wrapper">
      <h2 className="room-title">Room:{meetingId}</h2>

      <div
        className={`main-content ${
          chatOpen ? "chat-open" : participantOpen ? "participants-open" : ""
        }`}
      >
        <div
          className={`remote-grid users-${peers.length + 1} ${
            chatOpen || participantOpen ? "centered" : ""
          }`}
        >
          {peers.map(({ peerID, stream, username }) => (
            <Video key={peerID} stream={stream} username={username} />
          ))}

          {chatOpen && (
            <Video
              key={mySocketId}
              stream={streamRef.current}
              username={`${username} (You)`}
              isSelf={true}
              userVideoRef={userVideo}
              videoEnabled={videoEnabled}
            />
          )}
        </div>
        {chatOpen && (
          <div className="chat-box">
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${
                    msg.sender === username ? "my-message" : "other-message"
                  }`}
                >
                  <i className="">{msg.sender}:</i> {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage}>
                <SendIcon />
              </button>
            </div>
          </div>
        )}
        {participantOpen && (
          <div className="chat-box participants-box">
            <p>Participants</p>
            <div className="participants-names">
              <div className="participant-name">{username} (You)</div>
              {peers.map((p, idx) => (
                <div key={idx} className="participant-name">
                  {p.username}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {!chatOpen && !participantOpen && (
        <div className="own-video-box">
          <Video
            key={mySocketId}
            stream={streamRef.current}
            username={`${username} (You)`}
            isSelf={true}
            userVideoRef={userVideo}
            videoEnabled={videoEnabled}
          />
        </div>
      )}

      {/* Controls container */}
      <div className="controls-row">
        {[
          {
            onClick: toggleVideo,
            icon: videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />,
            alt: "toggle-video",
          },
          {
            onClick: toggleAudio,
            icon: audioEnabled ? <MicIcon /> : <MicOffIcon />,
            alt: "toggle-audio",
          },
          {
            onClick: toggleParticipant,
            icon: <PeopleIcon />,
            alt: "participants",
          },
          {
            onClick: toggleChat,
            icon: <ChatBubbleIcon />,
            alt: "chat",
          },
          isHost
            ? {
                onClick: () => socket.emit("end-meeting"),
                icon: <LogoutIcon />,
                alt: "end-meeting (host)",
              }
            : {
                onClick: endCall,
                icon: <LogoutIcon />,
                alt: "leave-call",
              },
        ].map(({ onClick, icon, alt }, i) => (
          <button
            key={i}
            onClick={onClick}
            className="control-btn"
            type="button"
            title={alt}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
function Video({
  stream,
  username,
  isSelf = false,
  userVideoRef,
  videoEnabled = true,
}) {
  const ref = useRef();
  useEffect(() => {
    const videoElement = isSelf ? userVideoRef?.current : ref.current;
    if (videoElement && stream) {
      videoElement.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-box">
      {isSelf && !videoEnabled ? (
        <div className="video-disabled">Video Disabled</div>
      ) : (
        <video
          playsInline
          autoPlay
          muted={isSelf}
          ref={isSelf ? userVideoRef : ref}
        />
      )}
      <h4 className="username">{username}</h4>
    </div>
  );
}
