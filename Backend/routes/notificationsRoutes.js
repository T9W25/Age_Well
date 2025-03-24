const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// ✅ Test API: Manually trigger a notification
router.post("/test", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newNotification = new Notification({
      userId,
      message,
      read: false,
    });

    await newNotification.save();

    res.json({ message: "Test notification sent!", newNotification });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
