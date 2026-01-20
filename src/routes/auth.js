const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const { BASIC_USER_FIELDS } = require("../utils/constants");

// Sign up
router.post("/signup", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

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
    const signUpUser = await user.save();

    // Generate token and attach to cookie
    const token = await signUpUser.getJWT();
    res.cookie("token", token);

    // Send a success message
    res
      .status(200)
      .json({
        success: true,
        message: "User added successfully!!",
        user: signUpUser,
      });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user in database by email
    const user = await User.findOne({ email: email });

    // 404 → User not found
    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 404;
      throw err;
    }

    // Compare entered password with hashed password stored in DB
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      // 401 → Unauthorized (wrong credentials)
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    // If EMAIL and PASSWORD are valid, login is successfull
    const token = await user.getJWT();
    res.cookie("token", token);

    res
      .status(200)
      .json({ success: true, message: "Login successfull!!", user });
  } catch (err) {
    next(err);
  }
});

// Logout
router.post("/logout", async (req, res, next) => {
  try {
    // res.cookie("token", null, { expires: new Date(Date.now()) });

    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
