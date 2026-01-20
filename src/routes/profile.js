const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

router.get("/profile/view", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({ success: true, message: "Fetch data successfully", user });
  } catch (err) {
    next(err);
  }
});

router.patch("/profile/edit", userAuth, async (req, res, next) => {
  try {
    // Validate the data
    if (!validateProfileEditData(req)) {
      const err = new Error("Invalid edit request");
      err.statusCode = 400;
      throw err;
    }

    const loggedInUser = req.user;

    // Check if this is first-time profile completion
    const isFirstTime = !loggedInUser.isProfileCompleted;

    // Updating the user profile
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    // Mark profile as completed (only once)
    if (!loggedInUser.isProfileCompleted) {
      loggedInUser.isProfileCompleted = true;
    }

    // Save the updated user profile
    await loggedInUser.save();

    res.status(200).json({
      success: true,
      message: `${loggedInUser.firstName}, Your profile updated successfully.`,
      user: loggedInUser,
      isFirstTime,
    });
  } catch (err) {
    next(err);
  }
});

// TODO: Make a API for FORGET PASSWORD

module.exports = router;
