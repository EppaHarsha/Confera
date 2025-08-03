// Fixed version of MeetingPage.jsx including Video component with black screen issue resolved

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { backendUrl } from "./utils/config";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import "./Meeting.css";

const socket = io(backendUrl);
const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

export default function MeetingPage() {
  const { state } = useLocation();
  const { username, meetingId, isMic = true, isCam = true } = state;
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(isCam);
  const [audioEnabled, setAudioEnabled] = useState(isMic);
  const [mySocketId, setMySocketId] = useState("");

  const userVideo = useRef();
  const streamRef = useRef();
  const peerConnections = useRef({});

  useEffect(() => {
    socket.on("connect", () => {
      setMySocketId(socket.id);
      socket.emit("join-meeting", { meetingId });
    });

    socket.on("host-confirmation", ({ isHost }) => {
      console.log("You are host:", isHost);
    });

    socket.on("meeting-ended", () => {
      toast.info("Meeting ended by host");
      navigate("/home");
    });

    socket.on("server-msg", ({ username: sender, message }) => {
      console.log(`${sender}: ${message}`);
    });

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
            if (!peerConnections.current[user.userId]) {
              const peer = createPeer(user.userId, stream);
              peerConnections.current[user.userId] = peer;
              setPeers((prev) => [
                ...prev,
                { peerId: user.userId, username: user.username, stream: null },
              ]);
            }
          });
        });

        socket.on("user-joined", ({ userId, username: newUsername }) => {
          if (!peerConnections.current[userId]) {
            const peer = addPeer(userId, stream);
            peerConnections.current[userId] = peer;
            setPeers((prev) => {
              const exists = prev.some((p) => p.peerId === userId);
              if (exists) return prev;
              return [
                ...prev,
                { peerId: userId, username: newUsername, stream: null },
              ];
            });
          }
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
        toast.error("Camera/Microphone access denied");
        navigate("/");
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createPeer = (userId, stream) => {
    const peer = new RTCPeerConnection({ iceServers });
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("signal", {
          to: userId,
          from: socket.id,
          signal: { candidate: e.candidate },
        });
      }
    };
    peer.ontrack = (e) => {
      console.log("✅ Received remote track for", userId, e.streams[0]);
      const videoTrack = e.streams[0].getVideoTracks()[0];
      console.log(
        "🎥 Track state:",
        videoTrack?.enabled,
        videoTrack?.readyState
      );

      setPeers((prev) =>
        prev.map((p) =>
          p.peerId === userId ? { ...p, stream: e.streams[0] } : p
        )
      );
    };

    peer.createOffer().then((offer) => {
      peer.setLocalDescription(offer);
      socket.emit("signal", {
        to: userId,
        from: socket.id,
        signal: { sdp: offer },
      });
    });

    return peer;
  };

  const addPeer = (fromId, stream) => {
    const peer = new RTCPeerConnection({ iceServers });
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("signal", {
          to: fromId,
          from: socket.id,
          signal: { candidate: e.candidate },
        });
      }
    };
    peer.ontrack = (e) => {
      console.log("✅ Received remote track for", fromId, e.streams[0]);
      const videoTrack = e.streams[0].getVideoTracks()[0];
      console.log(
        "🎥 Track state:",
        videoTrack?.enabled,
        videoTrack?.readyState
      );

      setPeers((prev) =>
        prev.map((p) =>
          p.peerId === fromId ? { ...p, stream: e.streams[0] } : p
        )
      );
    };
    return peer;
  };

  const toggleVideo = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
    }
  };

  const toggleAudio = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setAudioEnabled(track.enabled);
    }
  };

  return (
    <div>
      <h2>Room: {meetingId}</h2>
      <div className="remote-grid">
        {peers.map(({ peerId, stream, username }) => (
          <Video
            key={peerId + (stream ? "_1" : "_0")}
            stream={stream}
            username={username}
          />
        ))}
        <Video
          key={mySocketId}
          stream={streamRef.current}
          username={`${username} (You)`}
          isSelf={true}
          userVideoRef={userVideo}
          videoEnabled={videoEnabled}
        />
      </div>
      <div className="controls-row">
        <button onClick={toggleVideo}>
          {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </button>
        <button onClick={toggleAudio}>
          {audioEnabled ? <MicIcon /> : <MicOffIcon />}
        </button>
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
      videoElement.onloadedmetadata = () => {
        videoElement
          .play()
          .catch((err) => console.warn("Video play failed", err));
      };
    }
  }, [stream]);

  return (
    <div
      className="video-box"
      style={{ border: "2px solid lime", background: "#111" }}
    >
      <video
        playsInline
        autoPlay
        muted={isSelf}
        ref={isSelf ? userVideoRef : ref}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          display: "block",
        }}
      />
      <h4>{username}</h4>
    </div>
  );
}
