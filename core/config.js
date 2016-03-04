var vcapServices;
if (process.env.VCAP_SERVICES) {
    vcapServices = JSON.parse(process.env.VCAP_SERVICES);
} else {
    try {
        // for local environment only
        // file has to be placed in ./core directory
        // and should not be commited
        vcapServices = require('./VCAP_SERVICES.json');
    } catch (e) {
        console.error(e);
    }
}
exports.dbUrl = vcapServices.cloudantNoSQLDB[0].credentials.url;