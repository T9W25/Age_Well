// 🔧 NEW ROUTES: familyRoutes.js
const express = require("express");
const Notification = require("../models/Notification");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Ensure only family members can access this
const verifyFamily = (req, res, next) => {
  if (!req.user || req.user.role !== "family") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// ✅ Search elderly users
router.get("/search", verifyToken, verifyFamily, async (req, res) => {
  try {
    const { name, role } = req.query;
    const query = {
      role: role || "elderly",
      name: new RegExp(name, "i")
    };
    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Send connection request to elderly (Family)
router.post("/request-family/:elderlyId", verifyToken, verifyFamily, async (req, res) => {
  try {
    const elderly = await User.findById(req.params.elderlyId);
    if (!elderly || elderly.role !== "elderly") {
      return res.status(404).json({ message: "Elderly user not found." });
    }

    const family = await User.findById(req.user.id);

    const existingNotification = await Notification.findOne({
      userId: elderly._id,
      senderId: family._id,
      type: "family_request",
      read: false
    });

    if (existingNotification) {
      return res.status(400).json({ message: "Request already sent." });
    }

    const notification = new Notification({
      userId: elderly._id,
      senderId: family._id,
      message: `${family.name} is requesting to be connected as your family member.`,
      type: "family_request"
    });

    await notification.save();
    res.status(200).json({ message: "Family request sent!" });
  } catch (error) {
    console.error("Failed to send request:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Respond to family connection request (by elderly)
router.post("/respond-family-request/:notificationId", verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { accept } = req.body;

    const notification = await Notification.findById(notificationId);
    if (!notification || notification.type !== "family_request") {
      return res.status(404).json({ message: "Notification not found or invalid type" });
    }

    const elderly = await User.findById(notification.userId);
    const family = await User.findById(notification.senderId);

    if (!elderly || !family) {
      return res.status(400).json({ message: "Invalid family or elderly" });
    }

    if (req.user.id !== elderly._id.toString()) {
      return res.status(403).json({ message: "Only the elderly can respond to this request" });
    }

    if (accept) {
      elderly.assignedFamilyMember = family._id;
      await elderly.save();

      notification.read = true;
      await notification.save();

      return res.json({ message: "Family request accepted!" });
    } else {
      notification.read = true;
      await notification.save();
      return res.json({ message: "Family request rejected." });
    }
  } catch (error) {
    console.error("Error responding to family request:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get assigned elderly for family member
router.get("/family/assigned", verifyToken, verifyFamily, async (req, res) => {
  try {
    const family = await User.findById(req.user.id);
    if (!family) return res.status(404).json({ message: "Family member not found" });

    const elderly = await User.findOne({ assignedFamilyMember: family._id });
    res.json(elderly || {});
  } catch (error) {
    console.error("Error fetching assigned elderly:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;