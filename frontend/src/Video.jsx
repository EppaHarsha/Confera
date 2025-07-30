import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:3000");

function Video({ onCam, onMic }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userName,
    meetingId,
    // isMic = true,
    // isCam = true,
  } = location.state || {};
  console.log("State", location);
  const localVideoRef = useRef(null);
  const myStreamRef = useRef(null);
  const [peers, setPeers] = useState([]);
  const peerRef = useRef([]);

  useEffect(() => {
    const getStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          await localVideoRef.current.play();
        }
        myStreamRef.current = stream;

        socket.emit("join-room", { meetingId, userName });
        console.log("📤 Emitted join-room", { meetingId, userName });

        socket.on("all-users", (usersData) => {
          console.log("📥 Received all-users:", usersData);
          const peerArray = [];

          usersData.forEach(({ userId, userName }) => {
            console.log(
              `🔧 Creating peer as initiator for: ${userName} (${userId})`
            );
            const peer = createPeer(userId, socket.id, stream, userName);

            peerRef.current.push({ peerId: userId, peer, userName });
            peerArray.push({ peerId: userId, peer, userName });
          });

          setPeers(peerArray);
        });

        socket.on("user-joined", ({ userId, userName: newUserName }) => {
          console.log(`👋 User joined: ${newUserName} (${userId})`);

          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: myStreamRef.current,
          });

          peer.on("signal", (signal) => {
            console.log("📤 Sending signal (answer) to:", userId);
            socket.emit("signal", {
              to: userId,
              from: socket.id,
              signal,
            });
          });

          peerRef.current.push({
            peerId: userId,
            peer,
            userName: newUserName,
          });

          setPeers((users) => [
            ...users,
            { peerId: userId, peer, userName: newUserName },
          ]);
        });

        socket.on("signal", ({ from, signal }) => {
          console.log("📥 Received signal from:", from);
          const isItem = peerRef.current.find((p) => p.peerId === from);
          if (isItem) {
            console.log("✅ Found matching peer. Passing signal...");
            isItem.peer.signal(signal);
          } else {
            console.warn("⚠️ No matching peer found for:", from);
          }
        });

        socket.on("user-left", ({ userId }) => {
          peerRef.current = peerRef.current.filter((p) => p.peerId !== userId);
          setPeers((users) => users.filter((p) => p.peerId !== userId));
          console.log("userleft");
        });
      } catch (err) {
        console.error("❌ Error in getting stream", err);
      }
    };

    getStream();
    return () => {
      console.log("🔌 Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const videoTrack = myStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = onCam;
    }
  }, [onCam]);

  useEffect(() => {
    const audioTrack = myStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = onMic;
    }
  }, [onMic]);

  function createPeer(otherUserID, userId, stream, otherUserName) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log("📤 Sending signal (offer) to:", otherUserID);
      socket.emit("signal", { to: otherUserID, from: userId, signal });
    });

    return peer;
  }
  return (
    <>
      <div className="local-video">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{
            borderRadius: "12px",
            width: "400px",
            position:"relative",
            left:"630px",
            bottom:"-350px"
          }}
        ></video>
      </div>

      <div className="remote-video">
        {peers.map(({ peer, peerId, userName }) => (
          <RemoteVideo key={peerId} peer={peer} userName={userName} />
        ))}
      </div>
    </>
  );
}

function RemoteVideo({ peer, userName }) {
  const remoteVideo = useRef();
  useEffect(() => {
    peer.on("stream", (stream) => {
      console.log("📽️ Remote stream received from:", userName, stream);
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = stream;
      }
    });
  }, [peer]);
  return (
    <div>
      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        style={{ width: "200px", borderRadius: "12px" }}
      />
    </div>
  );
}

export default Video;

{
  /* 
      <button
        onClick={toggleVideo}
        style={{
          backgroundColor: onCam ? "#dc3545" : "#28a745",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          margin: "0 0.5rem",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {onCam ? "Turn Off Camera" : "Turn On Camera"}
      </button> */
}
{
  /* <button
        onClick={toggleMic}
        style={{
          backgroundColor: onMic ? "#dc3545" : "#28a745",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          margin: "0 0.5rem",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {onMic ? "Turn Off Camera" : "Turn On Camera"}
      </button> */
}

//     const toggleMic = () => {
//       const audioTrack = myStreamRef.current?.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setOnMic(audioTrack.enabled);
//       }
//     };

//   const toggleVideo = () => {
//     const videoTrack = myStreamRef.current?.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack.enabled = !videoTrack.enabled;
//       setOnCam(videoTrack.enabled);
//     }
//   };

// Disable video if camera was off
// const videoTrack = stream.getVideoTracks()[0];
// if (videoTrack) videoTrack.enabled = onCam;

// // Disable mic if mic was off
// const audioTrack = stream.getAudioTracks()[0];
// if (audioTrack) audioTrack.enabled = onMic;
