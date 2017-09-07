
if(process.browser)
    global.Perf = require('react-addons-perf');

module.exports = global.ENV = {
    ERROR_REPORTING_URL:"",
    SERVICE_WORKER_ON:false,
    API_URL:"http://192.168.151.111:8004"
};
