const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const verifyToken = require("../middleware/authMiddleware");

// ✅ Get Schedules (Elderly & Family can view, Caregiver can manage)
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.params.userId });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Create Schedule (Caregivers only)
router.post("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, date, time } = req.body;
    const newSchedule = new Schedule({
      userId: req.params.userId,
      title,
      description,
      date,
      time
    });

    await newSchedule.save();
    res.status(201).json({ message: "Schedule added!", newSchedule });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update Schedule (Caregivers only)
router.put("/:userId/:scheduleId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.scheduleId,
      { $set: req.body },
      { new: true }
    );

    res.json({ message: "Schedule updated!", updatedSchedule });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete Schedule (Caregivers only)
router.delete("/:userId/:scheduleId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Schedule.findByIdAndDelete(req.params.scheduleId);
    res.json({ message: "Schedule deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
