// Imports the Mongoose library
const mongoose = require("mongoose");

// Destructure Schema from mongoose
const { Schema } = mongoose;

// Creates a schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 15,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        if(!["male", "female", "other"].includes(value)) {
            throw new Error("Gender is not valid!")
        }
      }
    },
    aboutMe: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://i.pinimg.com/736x/18/b5/b5/18b5b599bb873285bd4def283c0d3c09.jpg",
    },
    skills: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

// Creates a model
const User = mongoose.model("User", userSchema);

// Exports the "User" model
module.exports = User;
