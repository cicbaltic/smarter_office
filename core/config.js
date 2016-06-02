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

if (process.env.env_custom) {
    vcapApplication = JSON.parse(process.env.env_custom);
} else {
    try {
        // for local environment only
        // file has to be placed in ./core directory
        // and should not be commited
        vcapApplication = require('./env_custom.json');
    } catch (e) {
        console.error(e);
    }
}
exports.twitter = {
	consumer_key: vcapApplication.twitter[0].consumer_key,
	consumer_secret: vcapApplication.twitter[0].consumer_secret,
	access_token_key: vcapApplication.twitter[0].access_token_key,
	access_token_secret: vcapApplication.twitter[0].access_token_secret
};