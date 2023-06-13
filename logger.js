const createLogger = (title) => {
    const logger = (message) => {
        console.log(`[${title}] : ${message}`);
        console.log();
    }
    return logger
}

module.exports = createLogger