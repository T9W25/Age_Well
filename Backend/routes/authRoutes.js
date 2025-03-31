const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware"); // Protect routes

const router = express.Router();

// ✅ Get Logged-in User Info (Frontend Calls This)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get User Health Details
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
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
    ).select("-password"); // Return updated user without password

    res.json({ message: "Health details updated!", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Register User (with role support)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Define valid roles
    const validRoles = ["elderly", "caregiver", "healthcare", "family", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user with role
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



// ✅ Login User (includes role in JWT)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT token with role
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include role
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
