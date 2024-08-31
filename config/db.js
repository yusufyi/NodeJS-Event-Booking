const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Connect to MongoDB
const db = async () => {
  const uri = process.env.MONGODB_URI;
  mongoose
    .connect(uri, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};
module.exports = db;
