const express = require('express')
const router = express.Router()

const pool = require('../common/connectDB')


router.get('/', async (req, res) => {
    try {

		const [category] = await pool.execute(`SELECT * FROM category`);
		if (category.length === 0)
			return res.status(200).json({ success: false, category: [] })
		return res.json({ success: true, category })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router