const express = require("express");
const mongoose = require("mongoose");
const eventRoutes = require("./routes/eventRoutes");
const cors = require('cors');
const app = express();
const PORT = 4000;

// MongoDB Connection
mongoose
  .connect("mongodb+srv://admin:satvik@cluster0.lw0dgjg.mongodb.net/event_log", {

  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

app.use(cors());

// Routes
app.use("/api/v1/events", eventRoutes);

// Error Handling
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
