require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB(); // Connect to MongoDB

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/vitalsRoutes"));
app.use("/api/checkin", require("./routes/checkInRoutes"));
app.use("/api/vitals", require("./routes/vitalsRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
