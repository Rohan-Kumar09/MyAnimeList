const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { addAnimeToUserList, getUserAnime } = require("../controllers/userController");

router.get("/user", verifyToken, getUserAnime);
router.post("/addAnimeToList", verifyToken, addAnimeToUserList);

module.exports = router;
