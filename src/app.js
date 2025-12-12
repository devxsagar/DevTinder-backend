// Import express module
const express = require("express");

// Create a instance of the Express application
const app = express();

// Route for the route(/) url
app.use("/", (req, res) => {
    res.send("Hurrah app is running....")
})

app.use("/test", (req, res) => {
    res.send("This is the testing file.")
})

// Start the server on port 3000
// Once the server starts, the callback function runs
app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000....");
});
