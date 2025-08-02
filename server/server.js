const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const db = require("./driver");
app.use(cors());

const { v4: uuidv4 } = require("uuid");

// initializes the database tables if they do not exist
async function serverStarter() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users_anime_list (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        coverImage VARCHAR(255),
        genres TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE (user_id, title)
      );
    `);
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

serverStarter();

app.listen(8080, () => {
  console.log("listening on port 8080...");
});

// api endpoint to add a user
async function addUser(req, res) {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ 
      error: "All fields are required"
    });
  }

  try {
    const [existing] = await db.query(
      `SELECT email FROM users WHERE email = ?`,
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ 
        error: "User with this email already exists" 
      });
    }

    const userId = uuidv4(); // Generate a unique ID for the user
    await db.query(
      `INSERT INTO users (id, email, username, password) VALUES (?, ?, ?, ?)`,
      [userId, email, username, password]
    );
    res.status(201).json({ 
      message: "User added successfully" 
    });
  } catch (err) {
    console.error("Add user DB error:", err);
    res.status(500).json({ 
      error: "Database error" 
    });
  }
}

// api endpoint to add anime to user's list
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

// api endpoint to get user's anime list by id
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

// API endpoints
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/addUser", addUser);
app.get("/user", getUserAnime);
app.post("/addAnimeToList", addAnimeToUserList);