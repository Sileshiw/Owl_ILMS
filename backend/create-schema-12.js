const pool = require("./config/database");
const fs = require("fs");

const sql = fs.readFileSync(
    "./database/schema/012_holds.sql",
    "utf8"
);

pool.query(sql)
    .then(() => {
        console.log("012_holds TABLE CREATED SUCCESSFULLY");
        return pool.end();
    })
    .catch((err) => {
        console.error("ERROR:", err.message);
        return pool.end();
    });