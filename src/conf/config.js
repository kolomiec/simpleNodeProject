var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: '../src/conf/config.json' });

module.exports = nconf;