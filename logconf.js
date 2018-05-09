var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: './log/filelog-info.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: './log/filelog-error.log',
            level: 'error'
        }),
        new (winston.transports.File)({
            name: 'warn-file',
            filename: './log/filelog-warn.log',
            level: 'warn'
        }),
        new (winston.transports.File)({
            name: 'exception-file',
            filename: './log/all-logs.log',
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});
module.exports = logger;