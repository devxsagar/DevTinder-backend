// Imports the Mongoose library
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Creates a schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      minLength: 1,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong.");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 15,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type.`,
      },
    },
    aboutMe: {
      type: String,
    },
    photoUrl: {
      type: String,
      default:
        "https://i.pinimg.com/736x/18/b5/b5/18b5b599bb873285bd4def283c0d3c09.jpg",
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("URL is not valid");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign({ _id: user.id }, "DEV@Tinder19", { expiresIn: "7d" });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;
};

// Creates a model
const User = mongoose.model("User", userSchema);

// Exports the "User" model
module.exports = User;
