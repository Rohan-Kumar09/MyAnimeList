require('dotenv').config();
const mysql = require("mysql2");

const poolOfConnections = mysql.createPool({
    // DO not need to specify the port being used because it is 3306 by default unless I want to overwrite it.
    host : process.env.DB_HOST,
    port: process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0
})

module.exports = poolOfConnections.promise();