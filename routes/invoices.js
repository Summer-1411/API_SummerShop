const express = require('express');
const router = express.Router();
const { createFilePdf, sendMailInvoice } = require('../service/invoiceService');
const { invoices } = require('../data/dataTest');

router.get('/', function (req, res) {
    res.render('invoice-list', {
        invoices: invoices,

        success: req.query['success'],
        error: req.query['error'],
    });
});
router.get('/:id', function (req, res) {
    const invoice = invoices.find(invoice => invoice.id === req.params['id']);

    console.log('invoice', invoice);
    console.log(req.params['id'], req.params['id']);
    
    if (!invoice) {
        res.redirect('/api/invoices');
    }
    res.render('invoice-single', { invoice });
});


router.get('/export/:id', async function (req, res) {

    const invoice = invoices.find(invoice => invoice.id === req.params['id']);
    if (!invoice) {
        res.redirect('/api/invoices?error=1');
    }
    
    res.render('invoice-single', { invoice }, (err, htmlContent) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error rendering HTML');
        }

        // Cài đặt các tùy chọn cho PDF
        const options = { format: 'Letter' };
        createFilePdf(htmlContent, options, res)
    });
});

router.post('/export_all', async function (req, res) {

    const { invoices } = req.body
    res.render('invoice-infor-list', { invoices }, (err, htmlContent) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error rendering HTML');
        }

        // Cài đặt các tùy chọn cho PDF
        const options = { format: 'Letter' };
        createFilePdf(htmlContent, options, res)
    });
});






router.post('/send_mail', async function (req, res) {
    const { invoice } = req.body
	if (!invoice) {
		return res
			.status(400)
			.json({ success: false, message: 'Thiếu tham số  !' })
	}
    
    res.render('invoice-single', { invoice }, (err, htmlContent) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Internal server error" })
        }

        // Cài đặt các tùy chọn cho PDF
        const options = { format: 'Letter' };

        // Tạo tệp PDF từ chuỗi HTML và tùy chọn
        sendMailInvoice(htmlContent, options, invoice, res)
        // pdf.create(htmlContent, options).toBuffer((pdfErr, buffer) => {
            
        //     if (pdfErr) {
        //         console.error('pdfErr : ',pdfErr);
        //         return res.status(500).json({ success: false, message: "Internal server error" })
        //     }
        //     const data = {
        //         email: invoice.email,
        //         subject: "Thông tin hóa đơn mua hàng",
        //         html: htmlContent
        //     }
        //     sendMail(data)

        //     return res.status(200).json({ success: true, message: "Gửi mã hóa đơn thành công !" })
        // });
    });
});



module.exports = router;