const os = require('os');

exports.arch = os.arch()
exports.homedir = os.homedir()
exports.cpus = os.cpus()
exports.totalmem = os.totalmem()
exports.freemem = os.freemem()
exports.platform = os.platform()
exports.uptime = os.uptime()
exports.userInfo = os.userInfo()
exports.networkInterfaces = os.networkInterfaces()