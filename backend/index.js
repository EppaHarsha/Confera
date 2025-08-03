require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authentication = require("./routes/authRoute.js");
const userMeetings = require("./routes/userMeetingRoute.js");
app.use(express.json());
const port = 3000 || process.env.PORT;
const url = process.env.MONGO_URL;
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const { handleSocket } = require("./controller/socketController.js");
app.use(
  cors({
    origin: [
      "https://confera-seven.vercel.app",
      "https://confera-rlby.onrender.com",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
let activeMeetings = {};
app.use("/", authentication);
app.use("/", userMeetings);

app.get("/api/meeting-exists/:meetingId", (req, res) => {
  const { meetingId } = req.params;
  const exists = !!activeMeetings[meetingId];
  res.json({ exists });
});

io.on("connection", (socket) => {
  handleSocket(io, socket, activeMeetings);
});

function db() {
  mongoose
    .connect(url)
    .then((res) => {
      console.log("db connected");
    })
    .catch((err) => {
      console.log(err);
    });
}
server.listen(port, () => {
  console.log("server is running on port 3000 ");
  db();
});
