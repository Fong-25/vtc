const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");


const isAuthenticated = (req, res, next) => {
    // console.log("Session userId:", req.session.userId);
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    next();
};
router.post("/signup", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Basic validation
        if (!username || !password || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();

        res.status(201).json({ message: "User created successfully! Login to continue." });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Wrong username or password" });
        }

        // Optionally, set a session or token (simple session for now)
        req.session.userId = user._id; // Store user ID in session
        res.status(200).json({ message: "Login successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

router.post("/logout", (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to log out: " + err.message });
            }
            res.clearCookie("connect.sid"); // Clear the session cookie (default name for express-session)
            res.status(200).json({ message: "Logged out successfully!" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

// New GET route to fetch user info
router.get("/user", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select("username email"); // Exclude password
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

// New PUT route to update user info
router.put("/user", isAuthenticated, async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Validate required fields
        if (!username?.trim() || !email?.trim()) {
            return res.status(400).json({ error: "Username and email are required" });
        }
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check for duplicate username (excluding self)
        if (username.trim() !== user.username) {
            const existingUser = await User.findOne({ username: username.trim() });
            if (existingUser) {
                return res.status(400).json({ error: "Username already exists" });
            }
        }

        // Update user data
        user.username = username.trim();
        user.email = email.trim();
        if (password?.trim()) {
            user.password = await bcrypt.hash(password.trim(), 10); // Hash new password if provided
        }

        await user.save();
        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

module.exports = router;