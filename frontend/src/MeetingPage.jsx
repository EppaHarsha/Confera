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
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import { backendUrl } from "./utils/config";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
const socket = io(backendUrl);
const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

export default function MeetingPage() {
  const { state } = useLocation();
  const { username, meetingId, isMic = true, isCam = true } = state;
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mySocketId, setMySocketId] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [participantOpen, setParticipantOpen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isHost, setIsHost] = useState(false);
  const userVideo = useRef();
  const streamRef = useRef();
  const peerConnections = useRef({});

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

    socket.on("meeting-ended", () => {
      toast.info("Meeting has been ended by Host!");
      navigate("/home");
    });

    return () => {
      socket.off("meeting-ended");
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
        stream.getVideoTracks().forEach((track) => (track.enabled = isCam));
        stream.getAudioTracks().forEach((track) => (track.enabled = isMic));

        userVideo.current.srcObject = stream;
        streamRef.current = stream;

        socket.emit("join-room", { meetingId, username });

        socket.on("all-users", (users) => {
          users.forEach((user) => {
            const peer = createPeer(user.userId, stream);
            peerConnections.current[user.userId] = peer;
            setPeers((prev) => [
              ...prev,
              {
                peerId: user.userId,
                username: user.username,
                stream: null,
                videoEnabled: user.videoEnabled ?? true,
              },
            ]);
          });
        });

        socket.on("user-joined", ({ userId, username: newUsername }) => {
          const peer = addPeer(userId, stream);
          peerConnections.current[userId] = peer;
          setPeers((prev) => [
            ...prev,
            {
              peerId: userId,
              username,
              stream: null,
              videoEnabled: videoEnabled ?? true,
            },
          ]);
        });

        socket.on("signal", async ({ from, signal }) => {
          const peer = peerConnections.current[from];
          if (peer) {
            try {
              if (signal.sdp) {
                await peer.setRemoteDescription(
                  new RTCSessionDescription(signal.sdp)
                );
                if (signal.sdp.type === "offer") {
                  const answer = await peer.createAnswer();
                  await peer.setLocalDescription(answer);
                  socket.emit("signal", {
                    to: from,
                    from: socket.id,
                    signal: { sdp: peer.localDescription },
                  });
                }
              } else if (signal.candidate) {
                await peer.addIceCandidate(
                  new RTCIceCandidate(signal.candidate)
                );
              }
            } catch (err) {
              console.error("Signal error:", err);
            }
          }
        });

        socket.on("user-left", ({ userId }) => {
          if (peerConnections.current[userId]) {
            peerConnections.current[userId].close();
            delete peerConnections.current[userId];
          }
          setPeers((prev) => prev.filter((p) => p.peerId !== userId));
        });
      })
      .catch(() => {
        toast.error("Media access denied. Please allow camera and mic.", {
          position: "bottom-center",
        });
        navigate("/");
      });

    return () => {
      socket.off("server-msg", handleServerMsg);
      socket.disconnect();
    };
  }, []);

  const createPeer = (userId, stream) => {
    const peer = new RTCPeerConnection({ iceServers });

    // Add tracks from local stream
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", {
          to: userId,
          from: socket.id,
          signal: { candidate: event.candidate },
        });
      }
    };

    peer.ontrack = (event) => {
      setPeers((prev) =>
        prev.map((p) =>
          p.peerId === userId ? { ...p, stream: event.streams[0] } : p
        )
      );
    };

    peer
      .createOffer()
      .then((offer) => peer.setLocalDescription(offer))
      .then(() => {
        socket.emit("signal", {
          to: userId,
          from: socket.id,
          signal: { sdp: peer.localDescription },
        });
      });

    return peer;
  };

  function addPeer(fromId, stream) {
    const peer = new RTCPeerConnection({ iceServers });
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", {
          to: fromId,
          from: socket.id,
          signal: { candidate: event.candidate },
        });
      }
    };
    peer.ontrack = (event) => {
      setPeers((prev) =>
        prev.map((p) =>
          p.peerId === fromId && !p.stream
            ? { ...p, stream: event.streams[0] }
            : p
        )
      );
    };
    return peer;
  }

  const toggleVideo = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
      socket.emit("video-toggled", {
        meetingId,
        userId: socket.id,
        isVideoEnabled: track.enabled,
      });
      setVideoRefreshKey((k) => k + 1);
    }
  };

  const toggleAudio = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setAudioEnabled(track.enabled);
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

  useEffect(() => {
    socket.on("show-screen-share-popup", ({ username }) => {
      toast.info(`${username} started screen sharing`, {
        position: "top-center",
      });
    });
  }, []);
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      handleScreenShare();
    }
  };

  const handleScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];

      Object.values(peerConnections.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);
      });

      userVideo.current.srcObject = screenStream;
      setIsScreenSharing(true);

      socket.emit("show-screen-share-popup", { username });

      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  const stopScreenShare = () => {
    const webcamTrack = streamRef.current?.getVideoTracks()[0];
    if (!webcamTrack) return;

    Object.values(peerConnections.current).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track.kind === "video");
      if (sender) sender.replaceTrack(webcamTrack);
    });

    userVideo.current.srcObject = streamRef.current;
    setIsScreenSharing(false);
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
          {peers.map(({ peerId, stream, username }) => (
            <Video key={peerId} stream={stream} username={username} />
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
            onClick: toggleScreenShare,
            icon: isScreenSharing ? (
              <StopScreenShareIcon />
            ) : (
              <ScreenShareIcon />
            ),
            alt: "toggle-screen-share",
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

    if (isSelf && !videoEnabled && videoElement) {
      // If video is disabled, stop all video tracks to show fallback UI
      const tracks = videoElement.srcObject?.getVideoTracks();
      if (tracks) tracks.forEach((track) => (track.enabled = false));
    }
  }, [stream, videoEnabled]);

  return (
    <div className="video-box">
      {isSelf && !videoEnabled ? (
        <div className="video-disabled">{username}</div>
      ) : (
        <video
          playsInline
          autoPlay
          muted={isSelf}
          ref={isSelf ? userVideoRef : ref}
          style={{
            display: videoEnabled || !isSelf ? "block" : "none",
          }}
        />
      )}
      <h4 className="username">{username}</h4>
    </div>
  );
}
