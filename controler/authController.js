const bcyrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const e = require("express");

// @route POST /api/auth/register
// @desc Register a new user
// @access Public

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    //Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    //Create new user
    user = new User({
      name,
      email,
      password,
    });

    //Hash password
    const salt = await bcyrpt.genSalt(10);
    user.password = await bcyrpt.hash(password, salt);

    //Save user to db
    await user.save();

    //Create token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    //Check if password is correct
    const isMatch = await bcyrpt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    //Create token
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { registerUser, loginUser };
