const express = require("express");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
app.use(express.json());
const db = require("./db");
app.use(cors());

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
});

app.use(limiter); 

// initializes the database tables if they do not exist
async function serverStarter() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users_anime_list (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        anime_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE (user_id, anime_id)
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