const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
/** @type {import('http-status')} */
const httpStatus = require("http-status");
const { createSecretToken } = require("./secretToken.js");

const User = require("./models/userModel");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const port = 3000;
const url = process.env.MONGO_URL;

app.post("/signup", async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;
  if (!userEmail || !userPassword || !userName) {
    return res.json({
      message: "Fill the details",
      success: false,
      error: true,
    });
  }
//   const user = {};
  const existingUser = await User.findOne({ userEmail });
  try {
    if (existingUser) {
      return res.json({ message: "User already exists", success: false });
    }
    const hashedpassword = await bcrypt.hash(userPassword, 12);
    const newUser = new User({
      userName: userName,
      userEmail: userEmail,
      userPassword: hashedpassword,
    });
    console.log(req.body);
    const ans = await newUser.save();
    console.log("done", ans);
    const token = createSecretToken(newUser._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    const userData = {
      userName: userName,
      userEmail: userEmail,
      userPassword: userPassword,
      token: token,
    };
    res.json({ message: "Welcome to Confera", success: true, userData });
  } catch (err) {
    res.json({ message: "something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { userEmail, userPassword } = req.body;
  if (!userEmail || !userPassword) {
    return res.json({
      message: "Fill the details",
      success: false,
      error: true,
    });
  }
  try {
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.json({ message: "User not exists", success: false });
    }
    const isPasswordCorrect = await bcrypt.compare(
      userPassword,
      user.userPassword
    );
    if (isPasswordCorrect) {
      const token = createSecretToken(user._id);
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      console.log("userName",user.userName)
      const userData = {
        userEmail: userEmail,
        token: token,
        userName:user.userName
      };
      res.status(201).json({
        message: "Welcome back",
        success: true,
        userData,
      });
    }
  } catch (err) {
    console.log(`error ${err}`);
    res.json({ message: `error something went wrong ${err}` });
  }
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
app.listen(port, () => {
  console.log("server is running on port 3000 ");
  db();
});
