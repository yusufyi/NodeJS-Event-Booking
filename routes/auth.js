const exprees = require("express");

const { registerUser, loginUser } = require("../controler/authController");
const router = exprees.Router();

// @route POST /api/auth/register
router.post("/register", registerUser);

// @route POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
