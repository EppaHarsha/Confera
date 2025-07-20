let roomUsers = {};
function handleSocket(io, socket) {
  console.log("User is connected!!", socket.id);
  socket.on("join-room", ({ meetingId, userName }) => {
    socket.join(meetingId);
    console.log(meetingId);
    console.log("user joined");
    socket.data.userName = userName;
    socket.data.meetingId = meetingId;
    if (!roomUsers[meetingId]) roomUsers[meetingId] = [];
    roomUsers[meetingId].push(socket.id);
    console.log(`${socket.id} joined the room ${meetingId}`);

    const otherUsers = roomUsers[meetingId].filter((id) => id !== socket.id);
    console.log(otherUsers);

    const usersData = otherUsers.map((id) => ({
      userId: id,
      userName: io.sockets.sockets.get(id)?.data?.userName || "User",
    }));

    socket.emit("all-users", usersData);

    socket.to(meetingId).emit("user-joined", {
      userId: socket.id,
      userName,
    });

    socket.on("signal", ({ to, from, signal }) => {
      io.to(to).emit("signal", { from, signal });
    });
    socket.on("disconnect", () => {
      const meetingId = socket.data.meetingId; // ✅ retrieve safely
      if (meetingId) {
        socket.to(meetingId).emit("user-left", { userId: socket.id });

        // ✅ Remove user from roomUsers list
        roomUsers[meetingId] = roomUsers[meetingId]?.filter(
          (id) => id !== socket.id
        );
        if (roomUsers[meetingId]?.length === 0) {
          delete roomUsers[meetingId];
        }
      }
    });
  });

  //Chat socket
  socket.on("join-meeting", ({ meetingId }) => {
    socket.join(meetingId);
    console.log("user joined meeting", socket.id);
  });
  socket.on("client-msg", ({ message, userName, meetingId }) => {
    const data = { userName, message };
    io.to(meetingId).emit("server-msg", data);
  });
}
module.exports = { handleSocket };
