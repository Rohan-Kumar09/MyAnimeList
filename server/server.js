const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const db = require("./driver");
app.use(cors());

// TODO: Write contracts here later


async function serverStarter(){
    // TODO: Still need to figure out schema design.
    // TODO: Write queries that create the schema
    try{
        await db.query(``);
    }catch (err){
        console.log(err);
    }
}
app.listen(8080, ()=>{
    console.log("listening on port 8080...");
})