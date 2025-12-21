const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

// middleware
app.use(express.json());

// Get a user by ID
app.get("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    //  const user = await User.findById({_id: userId});

    // or we can write like this
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.send("Something went wrong");
  }
});

// Get all the user for feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.send("Something went wrong!!");
  }
});

// Update user data
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    // await User.findByIdAndUpdate(userId, data); 

    // This is also correct or we can write like above one
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User data updated succesfully");
  } catch (error) {
    res.send("Something went wrong!!");
  }
});

// Delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.send("Something went wrong!!");
  }
});

app.post("/signup", async (req, res) => {
  // Create a User Document
  const user = new User(req.body);

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
