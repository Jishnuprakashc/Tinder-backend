const express = require("express");
const connectDB = require("./Config/Database");
const validator = require("validator");
const app = express();
const cookieParser = require('cookie-parser');
const authRouter =require('./Routes/auth');
const profileRouter =require('./Routes/profile');
const requestRouter =require('./Routes/request')
const userRouter =require('./Routes/user');
const cors = require("cors");
app.use(express.json()); //add the middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
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
 