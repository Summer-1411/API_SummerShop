const cron = require('node-cron');

const startProcess = () => {
    // Cron Job chạy mỗi phút để xóa log cũ hơn 2 ngày (chỉ để kiểm tra)
    cron.schedule('0 0 * * *', () => {
        console.log("Chạy Cron Job: Xóa log cũ...");
        // clearOldLogs();
    });

}
module.exports = startProcess