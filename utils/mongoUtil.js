const MongoClient = require('mongodb').MongoClient;
let ReadPreference = require('mongodb').ReadPreference;
const config = require('../config.js');

let _db;
let _client;

module.exports = {
    connectToServer: function (callback) {
        MongoClient.connect(config.mongo, {
            poolSize: config.mongoPoolSize,
            j: true,
            w: 1,
            readPreference: ReadPreference.PRIMARY_PREFERRED,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 5000,
        }, function (err, client) {
            if (client !== null){
                _client = client;
                _db = client.db(config.dbName);
            }
            return callback(err);
        });
    },
    getDb: function () {
        return _db;
    },
    getClient: function () {
        return _client;
    }
};
