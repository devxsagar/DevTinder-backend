const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { BASIC_USER_FIELDS } = require("../utils/constant");

// Get all received connection requests for the logged-in user
router.get("/user/requests/received", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    // Fetch connection requests sent to the logged-in user status with "interested"
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", BASIC_USER_FIELDS);

    // Populate sender's basic profile details
    // populate("fromUserId", ["firstName", "lastName", "skills"]);

    res.status(200).json({
      success: true,
      data: connectionRequests,
      message: "Fetch data successfully",
    });
  } catch (err) {
    next(err);
  }
});

// Get all the accepted connections for the logged-in user
router.get("/user/connections", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    // fetch all connections status with accepted
    // where logged-in user is either the sender or receiver
    const acceptedConnections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser?._id, status: "accepted" },
        { toUserId: loggedInUser?._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", BASIC_USER_FIELDS)
      .populate("toUserId", BASIC_USER_FIELDS);

    // If logged-in user is the sender, return the receiver
    // If logged-in user is the receiver, return the sender
    const data = acceptedConnections.map((connection) => {
      if ((connection?.fromUserId?._id).equals(loggedInUser?._id)) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.status(200).json({
      success: true,
      data,
      message: "Fetch data successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
