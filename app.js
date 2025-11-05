const express = require("express");
const connectDB = require("../src/Config/Database");
const validator = require("validator");
const app = express();
const cookieParser = require('cookie-parser');

const authRouter =require('./Routes/auth')
const profileRouter =require('./Routes/profile')
const requestRouter =require('./Routes/request')
const userRouter =require('./Routes/user')
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter)

connectDB()
  .then(() => {
    console.log("Database connection established successfully");
    app.listen(3000, () => {
      console.log("Server is running Successfully on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected", err);
  });
