
exports = require('./'+process.env.NODE_ENV);
global['app_version'] = process.env.APP_VERSION;