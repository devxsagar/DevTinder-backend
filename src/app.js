const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const User = require("./models/user");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);

// Global Error handle middleware
app.use(require("./middlewares/errorHandler"));

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
    // API level validator
    if (req.body?.skills.length > 5) {
      throw new Error("Five skills are allowed");
    }

    // await User.findByIdAndUpdate(userId, data);

    // This is also correct or we can write like above one
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
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
