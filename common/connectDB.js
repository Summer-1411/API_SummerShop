// const mysql = require("mysql2/promise")

// const connection =  await mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'db'
// })


// console.log('Connected!');

// module.exports = connection

const mysql = require('mysql2/promise');

// async function connectToDatabase() {
//     const connection = await mysql.createPool({
        
//     });
//     console.log("Connect DB");
//     return connection;
// }
const pool = mysql.createPool({
    host: "sql.freedb.tech",
    user: "freedb_tunglv27",
    password: "FgF!kE5TxPPzhW!",
    database: "freedb_my-shop"
})

pool.getConnection((err, conn) => {
    if(err){
        console.log(err);
    }
    console.log('success');
})

module.exports = pool;