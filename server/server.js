const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const db = require("./driver");
app.use(cors());

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

    await db.query(
      `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`,
      [email, username, password]
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

// api endpoint to get user information -- needs work
async function getUser(req, res) {
  const userEmail = req.query.email;
  if (!userEmail) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const [results] = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [userEmail]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(results);
  } catch (err) {
    console.error("Get user DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/addUser", addUser);
app.get("/user", getUser);

// initializes the database tables if they do not exist
async function serverStarter() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS anime (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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