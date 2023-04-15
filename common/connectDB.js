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
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db'
})

module.exports = pool;