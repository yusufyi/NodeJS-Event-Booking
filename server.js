const express = require("express");
const dotenv = require("dotenv");
const app = express();
const db = require("./config/db");
const cors = require("cors");

//Conntect to db
db();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", require("./routes/auth"));

//Listen on port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
