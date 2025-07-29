const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load .env and connect to MongoDB
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Invoice Backend API is running...");
});

// ✅ Routes
app.use("/api/auth", require("./routes/auth.routes")); // Login/Register
app.use("/api/invoices", require("./routes/invoice.routes")); // Invoice CRUD

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
