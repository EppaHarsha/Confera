const express = require("express");
const router = express.Router();
const Meeting = require("../models/userMeetings");

// Save meeting
router.post("/schedule", async (req, res) => {
  const { username, meetingId, title, date, time } = req.body;
  console.log(username, "from backend");
  try {
    const newMeeting = new Meeting({ username, meetingId, title, date, time });
    await newMeeting.save();
    res.status(201).json({ message: "Meeting saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save meeting" });
  }
});

// Get meetings for user
router.get("/user/:username", async (req, res) => {
  try {
    const meetings = await Meeting.find({ username: req.params.username });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
});

router.get(
  "/scheduledMeetingStarted/:username/:meetingId",
  async (req, res) => {
    try {
      const deletedMeeting = await Meeting.findOneAndDelete({
        username: req.params.username,
        meetingId: req.params.meetingId,
      });

      if (deletedMeeting) {
        console.log("Deleted meeting:", deletedMeeting);
        res.status(200).json({ message: "Meeting deleted successfully" });
      } else {
        res.status(404).json({ error: "Meeting not found" });
      }
    } catch (err) {
      console.error("Error deleting meeting:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
