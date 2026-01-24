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
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
      min: [15, "Age must be atleast 15 years"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `Please select a valid gender.`,
      },
    },
    aboutMe: {
      type: String,
      trim: true,
      maxlength: [160, "About me should be less than 160 characters"],
    },
    role: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("URL is not valid");
        }
      },
    },
    skills: {
      type: [String],
    },
    location: {
      type: String,
      trim: true,
      default: "Not specified",
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password; // Remove password from API response
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

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
