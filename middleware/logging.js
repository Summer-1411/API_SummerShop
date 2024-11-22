const apiLogRepository = require('../src/repository/ApiLogRepository');

const loggableUrls = ['auth', 'user', 'product/update', 'product/create', 'voucher', 'feedback', 'payment', 'order', 'cart', 'category', 'producer'];
const excludedUrls = ['search', 'filter', 'detail'];
const logRequest = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const { method, originalUrl } = req;

    const shouldLog = loggableUrls.some(keyword => originalUrl.includes(keyword)) &&
        !excludedUrls.some(keyword => originalUrl.includes(keyword)) &&
        method !== 'GET';
    if (shouldLog) {
        const bodyCopy = { ...req.body };
        if (bodyCopy.password) {
            delete bodyCopy.password;
        }

        const requestBody = JSON.stringify(bodyCopy);
        const startTime = Date.now();
        let responseBody = '';
        // const originalSend = res.send;
        // res.send = (body) => {
        //     responseBody = body; // Ghi lại response body
        //     return originalSend.call(res, body); // Gọi lại res.send gốc
        // };
        res.on('finish', () => {
            const responseTime = (Date.now() - startTime) / 1000;
            const statusCode = res.statusCode;
            const data = {
                method,
                url: originalUrl,
                requestBody,
                statusCode,
                responseBody,
                responseTime,
                userAgent,
                userId: req?.user ? req.user.id : null,
                ipAddress: ip
            }
            apiLogRepository.create(data);
        });
    }

    next();
};

module.exports = logRequest;