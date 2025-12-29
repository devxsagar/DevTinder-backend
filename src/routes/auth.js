const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate the data

    // Encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a User Document
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    // Saving data to database
    // it returns a promise hence await is used
    await user.save();

    // Send a success message
    res
      .status(200)
      .json({ status: true, message: "User added successfully!!" });
  } catch (err) {
    res.status(400).send("Error adding the user: " + err.message);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in database by email
    const user = await User.findOne({ email: email });

    if (!user) {
      // 404 → User not found
      return res.status(404).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password stored in DB
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      // 401 → Unauthorized (wrong credentials)
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // If EMAIL and PASSWORD are valid, login is successfull
    const token = await user.getJWT();
    res.cookie("token", token);

    res.status(200).json({ status: true, message: "Login successfull!!" });
  } catch (error) {
    // 500 → Internal server error
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    // res.cookie("token", null, { expires: new Date(Date.now()) });

    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
