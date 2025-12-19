const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://devxsagar:devXsagar@namastenode.gciiafy.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

