const mongoose = require("mongoose");
const { userAuth } = require("../Middleware/AdminAuth");
const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName gender  photoUrl  skills";
const ConnectionRequest = require("../models/connectionRequest");
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName","photoUrl","gender",]);

    res.json({
      message: "Data request fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const connectionRequest = await ConnectionRequest.find({
    $or: [
      { toUserId: loggedInUser._id, status: "accepted" },
      { fromUserId: loggedInUser._id, status: "accepted" },
    ],
  }).populate("fromUserId", USER_SAFE_DATA);
  const data = connectionRequest.map((row) => {
    if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
      return row.toUserId;
    }
    return row.fromUserId;
  });
  res.json({
    data,
  });
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({
      message: "Feed fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
module.exports = userRouter;
