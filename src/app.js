const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  // Create a User Document
  const user = new User({
    firstName: "Peter",
    lastName: "Parkour",
    email: "peter@gmail.com",
    password: "peter@123",
    age: 23,
    gender: "male",
  });

  try {
    // Saving data to database
    // it returns a promise hence await is used
    await user.save();

    // Send a success message
    res.send("User added successfully!!");
  } catch (err) {
    res.status(400).send("Error adding the user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000....");
    });
  })
  .catch((err) => {
    console.error("Databse connection failed", err);
  });
