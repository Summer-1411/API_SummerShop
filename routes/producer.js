const express = require('express')
const router = express.Router()

const pool = require('../common/connectDB')


router.get('/', async (req, res) => {
    try {

		const [producer] = await pool.execute(`SELECT * FROM producer`);
		if (producer.length === 0)
			return res.status(200).json({ success: false, producer: [] })
		return res.json({ success: true, producer })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router