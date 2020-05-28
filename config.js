module.exports = {
    mongoPoolSize: 39000,
    mongo: 'mongodb://root:root@192.168.101.68:27017,192.168.101.69:27017,192.168.101.70:27017/?authSource=admin&replicaSet=rs1',//mongodb数据库连接
    dbName: 'test_db', //数据库名称
    port: 3000, //当改为443时即启用tls
    privateKey: '/Users/jac/WebstormProjects/tiny-js/bin/server.key',
    certificate: '/Users/jac/WebstormProjects/tiny-js/bin/server.pem',
    v: '1.0.0',
    appName: 'tiny-js by 229292620@qq.com',
};
