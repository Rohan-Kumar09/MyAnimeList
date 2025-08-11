const db = require("../db");

// Function to add anime_id to user's saved list
async function addAnimeToUserList(req, res) {
  const { user_id, anime_id } = req.body;
  if (!user_id || !anime_id) {
    return res.status(400).json({ error: "User ID and anime ID are required" });
  }
  try {
  await db`INSERT INTO users_anime_list (user_id, anime_id) VALUES (${user_id}, ${anime_id})`;
    res.status(201).json({ message: "Anime added to user's list successfully" });
  } catch (err) {
    console.error("Add anime to user list DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

// Function to get user's saved anime list
// This function retrieves all anime IDs saved by the user
async function getUserAnime(req, res) {
  const user_id = req.query.user_id;
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const results = await db`SELECT anime_id FROM users_anime_list WHERE user_id = ${user_id}`;
    if (results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }
    res.status(200).json(results);
  } catch (err) {
    console.error("Get user DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

async function removeAnimeFromUserList(req, res) {
  const { user_id, anime_id } = req.body;
  if (!user_id || !anime_id) {
    return res.status(400).json({ error: "User ID and anime ID are required" });
  }
  try {
  await db`DELETE FROM users_anime_list WHERE user_id = ${user_id} AND anime_id = ${anime_id}`;
    res.status(200).json({ message: "Anime removed from user's list successfully" });
  } catch (err) {
    console.error("Remove anime from user list DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

async function deleteAccount(req, res) {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    await db`DELETE FROM users_anime_list WHERE user_id = ${userId}`;
    await db`DELETE FROM users WHERE id = ${userId}`;
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { addAnimeToUserList, getUserAnime, removeAnimeFromUserList, deleteAccount };