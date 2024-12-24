const cron = require('node-cron');
const apiLogRepository = require('../repository/ApiLogRepository');
const startProcess = () => {
    cron.schedule('0 0 * * *', () => {
        console.log('run schedule');

        apiLogRepository.deleteProcess()
    });

}
module.exports = startProcess