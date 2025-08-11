const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { addAnimeToUserList, getUserAnime, removeAnimeFromUserList, deleteAccount } = require("../controllers/userController");

router.get("/user", verifyToken, getUserAnime);
router.post("/addAnimeToList", verifyToken, addAnimeToUserList);
router.post("/removeAnimeFromList", verifyToken, removeAnimeFromUserList);
router.delete("/user/delete", verifyToken, deleteAccount);

module.exports = router;
