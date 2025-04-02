const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get Logged-in User Info (Frontend Calls This)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("❌ /me error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get User Health Details
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ /:userId error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update User Health Details
router.put("/:userId", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.json({ message: "Health details updated!", updatedUser });
  } catch (error) {
    console.error("❌ PUT /:userId error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Register User (with auto-login + debug logs)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("📥 Register attempt:", req.body);

    const validRoles = ["elderly", "caregiver", "healthcare", "family", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Login User (with debug logs)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔑 Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🧠 Password match:", isMatch);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
