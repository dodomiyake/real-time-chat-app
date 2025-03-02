const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ✅ Ensure required fields are provided
        if (!username || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // ✅ Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // ✅ Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create and save new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // ✅ Set Secure Cookie (Cross-Origin Fix)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None" // ✅ Fix for cross-origin cookies
        });

        res.status(201).json({
            msg: "User created successfully",
            user: { username: newUser.username, id: newUser._id }
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ✅ Ensure required fields are provided
        if (!username || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // ✅ Find user by username
        const user = await User.findOne({ username });

        // ✅ Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // ✅ Set Secure Cookie (Cross-Origin Fix)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None" // ✅ Fix for cross-origin cookies
        });

        res.json({ user: { username: user.username, id: user._id } });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
};
