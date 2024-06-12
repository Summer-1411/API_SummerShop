require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const crypto = require('crypto');
const path = require("path")

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const filterRoute = require('./routes/filter')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const producerRoute = require('./routes/producer')
const categoryRoute = require('./routes/category')
const orderDetailroute = require('./routes/order_detail')
const statRoute = require('./routes/stat')
const invoiceRoute = require('./routes/invoices')
const feedbackRoute = require('./routes/feedback')
const voucherRoute = require('./routes/voucher')
const paymentRoute = require('./routes/payment')

const app = express()
app.use(express.json())
app.use(cors())

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get('/redirect', (req, res) => {
    // Thực hiện chuyển hướng đến URL mong muốn
    res.redirect('http://localhost:3001/');
  });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.set('views', 'views');
app.set('view engine', 'hbs');
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.use('/api/filter', filterRoute)
app.use('/api/producer', producerRoute)
app.use('/api/category', categoryRoute)
app.use('/api/cart', cartRoute)
app.use('/api/order', orderRoute)
app.use('/api/order_detail', orderDetailroute)
app.use('/api/stat', statRoute)
app.use('/api/invoices', invoiceRoute)
app.use('/api/feedback', feedbackRoute)
app.use('/api/voucher', voucherRoute)
app.use('/api/payment', paymentRoute)


const PORT = process.env.PORT || 6868

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
