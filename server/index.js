const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const tutorProfilesRoutes = require("./routes/tutorProfiles");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Request headers:", req.headers);
  next();
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/tutor-profiles", tutorProfilesRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`Auth routes: http://localhost:${PORT}/api/auth/*`);
  console.log(
    `Tutor profiles routes: http://localhost:${PORT}/api/tutor-profiles/*`
  );
});
