const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const router = express.Router();

// Handle Status -> Interested or Ingonred
router.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      // Checking the status is valid or not
      const allowedStatus = ["interested", "ignored"];
      const isStatusAllowed = allowedStatus.includes(status);

      if (!isStatusAllowed) {
        const err = new Error("Status is not allowed: " + status);
        err.statusCode = 400;
        throw err;
      }

      // Prevent sending request to yourself
      if (fromUserId.equals(toUserId)) {
        const err = new Error("You can't send request to yourself!");
        err.statusCode = 400;
        throw err;
      }

      // Prevents sending request to non-existing user
      const toUserExist = await User.findById(toUserId);

      if (!toUserExist) {
        const err = new Error("User not found!");
        err.statusCode = 404;
        throw err;
      }

      // Prevent sending duplicate connection request
      const connectionRequestExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (connectionRequestExist) {
        const err = new Error("Connection request already exists!");
        err.statusCode = 400;
        throw err;
      }

      // Create a connectionRequest and save in DB
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const requestData = await connectionRequest.save();

      // Success response
      res.status(200).json({
        success: true,
        message:
          requestData.status === "interested"
            ? "Interest sent successfully."
            : "Profile ignored successfully.",
        data: requestData,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Handle Status -> Accepted or Rejected
router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Checking the status
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        const err = new Error("Status is not valid");
        err.statusCode = 400;
        throw err;
      }

      // Prevent non-existing request
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        const err = new Error("Connection request is not valid.");
        err.statusCode = 404;
        throw err;
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({
        success: true,
        data: data,
        message: "Connection request " + status,
      });
    } catch(err) {
      next(err);
    }
  }
);

module.exports = router;
