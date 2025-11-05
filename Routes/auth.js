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
    const { firstName, lastName, emailId, password } = req.body;

    //bcrypt the password
    const PasswordHash = await bcrypt.hash(password, 10);
    //Creating a mongoDB object
    const newUser = new User({
      firstName,
      lastName,
      emailId: emailId.toLowerCase(),
      password: PasswordHash,
    });
    await newUser.save();
    res.send("User Added Successfully");
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
      console.log(token);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
      res.send("Login Successfull");
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
    res.cookie("token","", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.send("logout successfull")
  } catch (err) {
    res.status(400).send("Logout Failed");
  }
});
module.exports = authRouter;
