const mysql = require('mysql2/promise');



// host: "sql.freedb.tech",
// user: "freedb_tunglv27",
// password: "FgF!kE5TxPPzhW!",
// database: "freedb_my-shop"

const configDatabaseLocal = {
    host: "localhost",
    user: "root",
    password: "",
    database: "db_shop"
}
const configDatabaseProduct = {
    host: "sql.freedb.tech",
    user: "freedb_freedb_summer_shop",
    password: "237Q5zUxp?*B7%q",
    database: "freedb_summer_shop-shop"
}
const pool = mysql.createPool(configDatabaseProduct)

pool.getConnection((err, conn) => {
    if (err) {
        console.log(err);
    }
    console.log('success');
})

module.exports = pool;