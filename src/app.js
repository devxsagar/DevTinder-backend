const express = require("express");
const cookieParser = require("cookie-parser");
let cors = require("cors");
const connectDB = require("./config/database");

const User = require("./models/user");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Global Error Handler Middleware
app.use(require("./middlewares/errorHandler"));

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 3000....");
    });
  })
  .catch((err) => {
    console.error("Databse connection failed", err);
  });
