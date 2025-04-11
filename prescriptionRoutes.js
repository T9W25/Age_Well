const express = require("express");
const Prescription = require("../models/Prescription");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create a new prescription (Only for Healthcare Professionals)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userId, medicationName, dosage, time, days, notificationMethod } = req.body;

    // ✅ Ensure only healthcare professionals can add prescriptions
    if (!req.user || req.user.role !== "healthcare") {
      return res.status(403).json({ message: "Access denied" });
    }

    const newPrescription = new Prescription({
      userId,
      doctorId: req.user.id,
      medicationName,
      dosage,
      time, // Keep it in "HH:MM AM/PM" format
      days,
      notificationMethod,
    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription saved!", prescription: newPrescription });
  } catch (error) {
    console.error("❌ Error saving prescription:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get prescriptions for a specific elderly user (User can fetch their own data)
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    // ✅ Allow user to get their own prescriptions
    if (req.user.id !== req.params.userId && req.user.role !== "healthcare") {
      return res.status(403).json({ message: "Access denied" });
    }

    const prescriptions = await Prescription.find({ userId: req.params.userId });
    res.json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Public API to fetch all prescriptions (for notifications, no token required)
router.get("/public/all", async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching all prescriptions:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
