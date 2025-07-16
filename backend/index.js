require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authentication = require("./routes/authRoute.js");
app.use(express.json());
const port = 3000;
const url = process.env.MONGO_URL;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/", authentication);

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
app.listen(port, () => {
  console.log("server is running on port 3000 ");
  db();
});
