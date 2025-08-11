require('dotenv').config();
const postgres = require('postgres');

const connectionString = process.env.SUPABASE_DB_URL;
const db = postgres(connectionString);

module.exports = db;