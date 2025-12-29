const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");

router.get("/profile/view", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.patch("/profile/update", async (req, res) => {
  try {
    // Validate the data
    if (!validateProfileEditData(req)) {
      return res.status(400).json({ message: "Invalid edit request" });
    }
  } catch (error) {}
});

module.exports = router;
