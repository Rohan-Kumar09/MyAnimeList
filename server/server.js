const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const db = require("./db");
app.use(cors());

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

// API endpoints
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});


const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(authRoutes);
app.use(userRoutes);