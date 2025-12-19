// Imports the Mongoose library
const mongoose = require("mongoose");

// Destructure Schema from mongoose
const { Schema } = mongoose;

// Creates a schema
const userSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String
    }
})

// Creates a model
const User = mongoose.model("User", userSchema);

// Exports the "User" model
module.exports = User;