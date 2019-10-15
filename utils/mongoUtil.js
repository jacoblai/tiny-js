const MongoClient = require('mongodb').MongoClient;
let ReadPreference = require('mongodb').ReadPreference;
const url = "mongodb://root:root@192.168.101.68:27017,192.168.101.69:27017,192.168.101.70:27017/?authSource=admin&replicaSet=rs1";

let _db;
let _client;

module.exports = {
    connectToServer: function (callback) {
        MongoClient.connect(url, {
            poolSize: 39000,
            j: true,
            w: 1,
            readPreference: ReadPreference.PRIMARY_PREFERRED,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 2000,
        }, function (err, client) {
            if (client !== null){
                _client = client;
                _db = client.db('test_db');
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
