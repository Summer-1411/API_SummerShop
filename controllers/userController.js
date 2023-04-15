const db = require("../common/connectDB")

const getUserByEmail = (email) => {
    db.query(`SELECT * FROM user WHERE email = ${email}`, function(err, user){
        if(err)
        {
            return null
        }else {
            return user
        }
    })
}
module.exports = {
    getUserByEmail
}