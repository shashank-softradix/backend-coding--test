const winston = require('winston')
const path = require('path')
module.exports = {
    async logger (message, data) {
        let logFileName = path.join(__dirname, 'log/backend-coding-test-master.app.log');
        let errorLogFileName = path.join(__dirname, 'log/backend-coding-test-master.error.log');
        let logger = null;

        logger = await winston.createLogger({
            format: winston.format.json(),
            exceptionHandlers: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: errorLogFileName,
                    level: 'error',
                })
            ],

            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: logFileName,
                })
            ]
        });

        logger.log('error', message, data)
    }
}