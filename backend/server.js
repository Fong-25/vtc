const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const capsulesRoutes = require("./routes/capsules");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true, // Allow cookies/sessions
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/capsules", capsulesRoutes.router);

// Serve frontend (for production)
app.use(express.static(path.join(path.resolve(), "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(path.resolve(), "frontend", "dist", "index.html"));
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});