const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const db = require("./driver");
app.use(cors());


async function serverStarter(){
    try{
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
    } catch (err){
        console.log(err);
    }
}

serverStarter();

app.listen(8080, ()=>{
    console.log("listening on port 8080...");
})