const db = require("../common/connectDB")

const getUserByEmail = async (email) => {
    await db.query(`SELECT * FROM user WHERE email = ?`, email, function(err, user){
        if(err)
        {
            console.log("User", err);
            return null
        }else {
            console.log("User", user);
            return user
        }
    })
}
module.exports = {
    getUserByEmail
}