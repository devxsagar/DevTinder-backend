const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { BASIC_USER_FIELDS } = require("../utils/constants");

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

// Get user feed excluding already connected/requested users
router.get("/feed", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    // Pagination params (default values)
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;

    // Restrict max limit to avoid heavy DB load
    limit = limit > 50 ? 50 : limit;

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Fetch all connection requests where the user is involved
    // (either sender or receiver)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // Store userIds that should be hidden from the feed
    // (already connected / requested / ignored)
    const hideRequestsFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideRequestsFromFeed.add(req?.fromUserId.toString());
      hideRequestsFromFeed.add(req?.toUserId.toString());
    });

    // Fetch users excluding:
    // 1. Users already in connection requests
    // 2. The logged-in user himself
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideRequestsFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(BASIC_USER_FIELDS)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      message: "Data fetched successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
