const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

async function authenticateUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
  const result = await db`SELECT * FROM users WHERE email = ${email}`;
    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: "30m" }
    );
    res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

async function addUser(req, res) {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await db`SELECT email FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userId = uuidv4();
  await db`INSERT INTO users (id, email, username, password) VALUES (${userId}, ${email}, ${username}, ${hashedPassword})`;
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    console.error("Add user DB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

// Refresh JWT token
async function refreshToken(req, res) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ error: "Malformed token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    // Optionally, you can check if the token is expired and only allow refresh if so
    const newToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username
      },
      JWT_SECRET,
      { expiresIn: "30m" }
    );
    res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
      user: {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username
      }
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { authenticateUser, addUser, refreshToken };
