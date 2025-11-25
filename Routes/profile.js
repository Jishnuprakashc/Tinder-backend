console.log("RUNNING FILE:", __filename);
const express = require("express");
const User = require("../models/user");
const { ValidateEditProfileData } = require("../utils/Validation");
const profileRouter = express.Router();
const { userAuth } = require("../Middleware/AdminAuth");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});
profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValid = ValidateEditProfileData(req);
    if (!isValid) {
      throw new Error(" Email and password are not allowed to edit ");
    }
    const updatedUsers = await User.findByIdAndUpdate( 
      req.user._id, // Use authenticated 
      req.body, //Update with allowed fields

      { new: true, runValidators: true }
    );
    res.json({
      message: "Validation Passed. Profile is Updated Successfully",
      data: updatedUsers,  
    });
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});
module.exports = profileRouter;
 