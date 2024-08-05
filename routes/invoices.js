const express = require('express');
const router = express.Router();
const { createFilePdf, sendMailInvoice } = require('../service/invoiceService');
const { invoices } = require('../data/dataTest');
const Layout = require('../views/Layout');
const SinglePage = require('../views/SinglePage');
const ListPage = require('../views/ListPage');

router.get('/', function (req, res) {
    res.render('invoice-list', {
        invoices: invoices,

        success: req.query['success'],
        error: req.query['error'],
    });
});



router.get('/:id', function (req, res) {
    const invoice = invoices.find(invoice => invoice.id === req.params['id']);
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


router.post('/export_id', async function (req, res) {

    const invoice = req.body

    console.log('invoice',invoice);
    const htmlContent = Layout(SinglePage(invoice))

    console.log('htmlContent',htmlContent);
    const options = { format: 'Letter' };
    createFilePdf(htmlContent, options, res)

});


router.post('/export_all', async function (req, res) {

    const { invoices } = req.body
    const htmlContent = Layout(ListPage(invoices))
    // Cài đặt các tùy chọn cho PDF
    const options = { format: 'Letter' };
    createFilePdf(htmlContent, options, res)
});






router.post('/send_mail', async function (req, res) {
    const invoice = req.body
    const htmlContent = Layout(SinglePage(invoice))
    const options = { format: 'Letter' };
    sendMailInvoice(htmlContent, options, invoice, res)
});



module.exports = router;