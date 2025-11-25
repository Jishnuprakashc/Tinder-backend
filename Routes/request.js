const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middleware/AdminAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post( 
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      //sending connection request 
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status type: " + status,
        }); 
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId }, // A sent to B
          { fromUserId: toUserId, toUserId: fromUserId }, // B sent to A
        ],
      });
      if (existingConnectionRequest) {
       return res.status(400).send({ message: "Connection request already exists" });
      }
      const toUser = await User.findById(toUserId); 
      if (!toUser) {
        return res.status(400).json({
          message: "user not found",
        });
      }
      if (fromUserId.toString() === toUserId.toString()) {
        return  res.status(400).json({
          message: "Invalid Connection Request",
        });
      }
      const data = await connectionRequest.save();
      res.json({
        message:`${req.user.firstName} is ${status} in ${toUser.firstName}.`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status not allowed",
        });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if(!connectionRequest){
        return res.status(400).json({
          message:"Connection Request not found"
        })
      }
      connectionRequest.status =status;
      const data = await connectionRequest.save();
      return res.json({
        message:`Connection request is ${status}`, data
      })
    } catch (err) {
      return res.status(404).send("ERROR" + err.message);
    }
  }
);
module.exports = requestRouter;
