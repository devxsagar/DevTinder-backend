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

router.patch("/profile/update", async (req, res, next) => {
  try {
    // Validate the data
    if (!validateProfileEditData(req)) {
      const err = new Error("Invalid edit request");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
