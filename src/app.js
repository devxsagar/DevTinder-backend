// Import express module
const express = require("express");

// Create a instance of the Express application
const app = express();

// This will only handle GET call to "/user"
app.get("/user", (req, res) => {
  res.send({ name: "Eren", age: 22, isLoggedIn: true });
});

// Only handle POST call to "/user"
app.post("/user", (req, res) => {
  res.send("Data successfully added to the database");
});

// Only handle DELETE call to "/user"
app.delete("/user", (req, res) => {
  res.send("User deleted successfully");
});

// This will match alll the HTTP method API calls to "/test"
app.use("/test", (req, res) => {
  res.send("This is the testing file.");
});

// Route for the route(/) url
app.use("/", (req, res) => {
  res.send("Hurrah app is running....");
});

// Start the server on port 3000
// Once the server starts, the callback function runs
app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000....");
});
