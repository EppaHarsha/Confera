require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authentication = require("./routes/authRoute.js");
app.use(express.json());
const port = 3000;
const url = process.env.MONGO_URL;
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
// const {handleSocket} = require('./controller/socketController.js');
app.use(cors({
  origin: "*",
  methods:["GET","POST","PATCH","PUT","DELETE"],
  credentials: true,
}));

const io = new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"],
    credentials:true,
  },
})

app.use("/", authentication);

io.on("connection",(socket)=>{
    handleSocket(io,socket);
})

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
