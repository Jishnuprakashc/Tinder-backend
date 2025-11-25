const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    }, 
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender `,
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80",
    },
    skills: {
      type: [String],
    },
    about: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.index({ firstName: 1, lastName: 1 });
const User = mongoose.model("User", UserSchema);
module.exports = User;
