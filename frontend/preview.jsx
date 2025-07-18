// import React from "react";
// import { useState,useEffect} from "react";
// import { useNavigate,useLocation } from "react-router-dom";
// function Preview() {
//   useEffect(() => {
//     const getVideo = async () => {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       if (localVideoRef.current.srcObject) {
//         localVideoRef.current.srcObject = stream;
//         myStreamRef.current = stream;
//       }
//     };
//     getVideo();
//   }, []);

//   const joinMeeting = () => {
//     navigate("/joinMeet", {
//       state: { userName: userName, meetingId: meetingId },
//     });
//   };

//   const toggleMic = () => {
//     const getAudio = myStreamRef.current?.getAudioTracks()[0];
//     if (getAudio) {
//       console.log(getAudio.enabled);
//       getAudio.enabled = !getAudio.enabled;
//       setIsMic(getAudio.enabled);
//     }
//   };

//   const toggleVideo = () => {
//     const getVideo = myStreamRef.current?.getVideoTracks()[0];
//     if (getVideo) {
//       getVideo.enabled = !getVideo.enabled;
//       setIsCam(getVideo.enabled);
//     }
//   };
//   return (
//     <>
//       <div>
//         <h2>Preview</h2>
//         <h1>user:{userName}</h1>
//         <h1>meetingId:{meetingId}</h1>
//       </div>
//       <video
//         ref={localVideoRef}
//         autoPlay
//         muted
//         playsInline
//         style={{ width: "200px", height: "300px", border: "2px solid white" }}
//       />
//       <div>
//         <button onClick={toggleVideo}>{isCam ? "off cam" : "on cam"}</button>
//         <button onClick={toggleMic}>{isMic ? "off mic" : "On mic"}</button>
//       </div>
//       <div>
//         <button onClick={joinMeeting}>Join Meeting</button>
//       </div>
//     </>
//   );
// }

// export default Preview;
