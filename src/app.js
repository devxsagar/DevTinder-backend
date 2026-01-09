const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const User = require("./models/user");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");  
const requestRouter = require("./routes/request")

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter)

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
