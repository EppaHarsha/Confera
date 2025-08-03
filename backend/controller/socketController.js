const hostMap = {};

function handleSocket(io, socket, activeMeetings) {
  console.log("User is connected!!", socket.id);

  // Chat logic
  socket.on("join-meeting", ({ meetingId }) => {
    socket.join(meetingId);
    console.log(`User ${socket.id} joined meeting ${meetingId} for chat.`);
  });

  socket.on("client-msg", ({ message, username, meetingId }) => {
    const data = { username, message };
    io.to(meetingId).emit("server-msg", data);
  });

  // Video call logic
  socket.on("join-room", ({ meetingId, username }) => {
    activeMeetings[meetingId] = true;
    console.log(activeMeetings);
    socket.data.username = username;
    socket.join(meetingId);
    if (!hostMap[meetingId]) {
      hostMap[meetingId] = socket.id;
      socket.data.isHost = true;
      console.log(`User ${socket.id} is HOST of ${meetingId}`);

      // Notify this user they are host
      socket.emit("host-confirmation", { isHost: true });
    } else {
      socket.data.isHost = false;
      console.log(`User ${socket.id} is PARTICIPANT of ${meetingId}`);

      // Notify this user they are NOT host
      socket.emit("host-confirmation", { isHost: false });
    }

    // Notify the joining user about existing users
    const usersInRoom = Array.from(
      io.sockets.adapter.rooms.get(meetingId) || []
    )
      .filter((id) => id !== socket.id)
      .map((id) => ({
        userId: id,
        username: io.sockets.sockets.get(id)?.data?.username || "User",
      }));
    socket.emit("all-users", usersInRoom);

    // Notify others that a new user joined
    socket.to(meetingId).emit("user-joined", {
      userId: socket.id,
      username,
    });

    // Forward signaling data to the intended peer
    socket.on("signal", ({ to, from, signal }) => {
      io.to(to).emit("signal", { from, signal });
    });

    socket.on("end-meeting", () => {
      const meetingId = [...socket.rooms][1]; // get the room name

      if (hostMap[meetingId] === socket.id) {
        console.log(`Host ${socket.id} ended meeting ${meetingId}`);
        io.to(meetingId).emit("meeting-ended");
        delete hostMap[meetingId]; // Clean up
      }
    });
    socket.on("screen-share-started", ({ username, meetingId }) => {
      socket.to(meetingId).emit("show-screen-share-popup", {
        username,
      });
    });

    // When someone leaves
    socket.on("disconnect", () => {
      socket.to(meetingId).emit("user-left", { userId: socket.id });
      // const room = io.sockets.adapter.rooms.get(meetingId);
      // if (!room || room.size === 0) {
      //   activeMeetings.delete(meetingId);
      // }
    });
  });
}

module.exports = { handleSocket };
