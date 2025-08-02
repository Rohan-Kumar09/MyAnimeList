const db = require("../db");

async function addAnimeToUserList(req, res) {
  const { userId, title, description, coverImage, genres } = req.body;
  if (!userId || !title) {
    return res.status(400).json({ error: "User ID and title are required" });
  }
  try {
    await db.query(
      `INSERT INTO users_anime_list (user_id, title, description, coverImage, genres) VALUES (?, ?, ?, ?, ?)`,
      [userId, title, description, coverImage, genres]
    );
    res.status(201).json({ message: "Anime added to user's list successfully" });
  } catch (err) {
    console.error("Add anime to user list DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

async function getUserAnime(req, res) {
  const user_id = req.query.user_id;
  if (!user_id) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const [results] = await db.query(
      `SELECT * FROM users_anime_list WHERE user_id = ?`,
      [user_id]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }
    res.status(200).json(results);
  } catch (err) {
    console.error("Get user DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { addAnimeToUserList, getUserAnime };