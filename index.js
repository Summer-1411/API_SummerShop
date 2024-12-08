require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const crypto = require('crypto');
const path = require("path")
const cron = require('node-cron');
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

///

///api-v1
const productController = require('./src/controller/ProductController')
const filterController = require('./src/controller/FilterController')
const userController = require('./src/controller/UserController');
const apiLogController = require('./src/controller/ApiLogController');
const orderController = require('./src/controller/OrderController');
const voucherController = require('./src/controller/VoucherController');
const firebaseTokenController = require('./src/controller/FirebaseTokenController');
const logRequest = require('./middleware/logging');
const startProcess = require('./src/process/logApi');

const admin = require('firebase-admin');
// const serviceAccount = require('./summer-309f4-08c43657ba69.json');
const app = express()
app.use(express.json())
app.use(cors())
app.use(logRequest);

// Khởi tạo Firebase Admin SDK
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

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


//api-v1
app.use('/api/v1/product', productController)
app.use('/api/v1/filter', filterController)
app.use('/api/v1/user', userController)
app.use('/api/v1/api-log', apiLogController)
app.use('/api/v1/firebase-token', firebaseTokenController)
app.use('/api/v1/order', orderController)
app.use('/api/v1/voucher', voucherController)


startProcess()

const PORT = process.env.PORT || 6868

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
