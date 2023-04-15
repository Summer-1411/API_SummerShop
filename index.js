require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const filterRoute = require('./routes/filter')
const cartRoute = require('./routes/cart')
const cartDetailRoute = require('./routes/cartDetail')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.use('/api/filter', filterRoute)
app.use('/api/cart', cartRoute)
app.use('/api/cartdetail', cartDetailRoute)


const PORT = process.env.PORT || 6868

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
