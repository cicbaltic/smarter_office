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
exports.twitter = {
	consumer_key: vcapServices.twitter[0].consumer_key,
	consumer_secret: vcapServices.twitter[0].consumer_secret,
	access_token_key: vcapServices.twitter[0].access_token_key,
	access_token_secret: vcapServices.twitter[0].access_token_secret
};