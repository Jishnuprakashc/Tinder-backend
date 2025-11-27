const express = require("express");
const { validateSignupData } = require("../utils/Validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
//signupPage
authRouter.post("/signup", async (req, res) => {
  //validation of data
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password, photoUrl, about, age } =
      req.body;

    //bcrypt the password
    const PasswordHash = await bcrypt.hash(password, 10);
    //Creating a mongoDB object
    const newUser = new User({
      firstName,
      lastName,
      emailId: emailId.toLowerCase(),
      password: PasswordHash,
      photoUrl,
      about,
      age
    });
    
    const savedUser =await newUser.save();
    const token = jwt.sign({ _id: savedUser._id }, "mySecretkey", {
      expiresIn: "7d",
    });

    // save token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({message:"User added Successfully",data:savedUser});
  } catch (err) {
    res.status(400).send(err.message);
  }
});
//login page
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId.toLowerCase() });
    if (!user) {
      throw new Error("Invalid Credential");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      //Create a JWT Token 

      const token = await jwt.sign({ _id: user._id }, "mySecretkey", {
        expiresIn: "7d",
      });
        res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
      res.send(user);
    } else {
      throw new Error("Invalid  password");
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});
//logout page
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.send("logout successfull");
  } catch (err) {
    res.status(400).send("Logout Failed");
  }
});
module.exports = authRouter;
