require("dotenv").config(); // 

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); 

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/vitalsRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
