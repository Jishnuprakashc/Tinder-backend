const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true
    
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum:{
       values: ["male","female","other"],
       message:`{VALUE} is not a valid gender `
    }
  },
  photourl: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEg09MmHvC-78aaRxyd52HabsZqI1-u8R6-w&s"
  },
  skills: {
    type: [String]
  }
}, {
  timestamps: true
});
UserSchema.index({firstName:1,lastName:1});
const User = mongoose.model("User", UserSchema);
module.exports = User;
