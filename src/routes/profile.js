const express = require("express");
const router = express.Router();

const {userAuth} = require("../middlewares/auth");


router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(401).send("Invalid or expired token");
  }
});




module.exports = router;