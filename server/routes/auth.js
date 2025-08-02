const express = require("express");
const router = express.Router();
const { addUser, authenticateUser, refreshToken } = require("../controllers/authController");

router.post("/login", authenticateUser);
router.post("/addUser", addUser);
router.post("/refresh", refreshToken);

module.exports = router;
