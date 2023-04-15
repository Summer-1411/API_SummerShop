const register = (req, res) => {
    const { firstName, lastName, email, address } = req.body
    const data = {firstName, lastName, email, address}
    db.query(`INSERT INTO users SET ?`, data, function(err, user){
        if(err)
        {
            res.status(500).json({ success: false, message: err })
        }else {
            res.status(200).json({ success: true, newUser: {id: user.insertId, ...data} })
        }
    })
}