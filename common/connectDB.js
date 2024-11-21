const mysql = require('mysql2/promise');



// host: "sql.freedb.tech",
// user: "freedb_tunglv27",
// password: "FgF!kE5TxPPzhW!",
// database: "freedb_my-shop"
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "db"
})

pool.getConnection((err, conn) => {
    if (err) {
        console.log(err);
    }
    console.log('success');
})

module.exports = pool;