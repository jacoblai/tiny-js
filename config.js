let fs = require("fs");

module.exports = {
    mongoPoolSize: 39000,
    mongo: 'mongodb://root:root@192.168.101.68:27017,192.168.101.69:27017,192.168.101.70:27017/?authSource=admin&replicaSet=rs1',//mongodb数据库连接
    dbName: 'test_db', //数据库名称
    port: 3000, //当改为443时即启用tls
    privateKey: fs.readFileSync(__dirname + '/server.key', 'utf8'),
    certificate: fs.readFileSync(__dirname + '/server.pem', 'utf8'),
    v: '1.0.0',
    appName: 'tiny-js by 229292620@qq.com',
};
