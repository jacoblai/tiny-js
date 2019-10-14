const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb://root:root@192.168.101.68:27017,192.168.101.69:27017,192.168.101.70:27017/?authSource=admin&replicaSet=rs1";

let _db;

module.exports = {
    connectToServer: function( callback ) {
        MongoClient.connect( url,{ useNewUrlParser: true, useUnifiedTopology: true }, function( err, client ) {
            _db  = client.db('test_db');
            return callback( err );
        } );
    },
    getDb: function() {
        return _db;
    }
};
