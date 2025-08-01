const User = require('../models/userModel.js')
const bcrypt = require("bcrypt");
const { createSecretToken } = require('../secretToken.js')

//Signup ----

module.exports.signup = async (req, res) => {
  const { username, userEmail, userPassword } = req.body;
  console.log( "My username",username)
  if (!userEmail || !userPassword || !username) {
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
      username: username,
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
      username: username,
      userEmail: userEmail,
      userPassword: userPassword,
      token: token,
    };
    res.json({ message: "Welcome to Confera", success: true, userData });
  } catch (err) {
    res.json({ message: "something went wrong" });
  }
}

//Login in---

module.exports.login=async (req, res) => {
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
      console.log("userName", user);
      const userData = {
        userEmail: userEmail,
        token: token,
        username: user.username,
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
}