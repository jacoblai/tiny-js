let express = require('express');
let fs = require("fs");
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
let logger = require('morgan');
const gql = require('graphql-tag');
const {buildASTSchema} = require('graphql');
let mongoUtil = require('./utils/mongoUtil');
let messageCon = require('./controllers/messageController');

let app = express();
app.use(cors());

function defaultContentTypeMiddleware(req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}

app.use(defaultContentTypeMiddleware);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

function auth(req, res, next) {
    if (req.method === "POST"){
        let uid = req.header("Authentication");
        if (uid === "jacoblai") {
            req.headers["role"] = "admin";
            console.log('uid:', uid);
        }
    }
    next();
}

app.use(auth);

mongoUtil.connectToServer(function (err) {
    if (err){
        console.log("error: " + err.name +" "+ err.message);
        return
    }
    let root = {};

    //message
    let msgCon = new messageCon();
    msgCon.setRoot(root);

    //load schema
    let schema = fs.readFileSync(__dirname+'/bin/schema.graphql', 'utf8');
    // console.log(schema);
    app.use('/', graphqlHTTP({
        schema: buildASTSchema(gql(schema)),
        rootValue: root,
        graphiql: false,
        pretty: false,
    }));

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.json({ok: 0, n: 0, err: err.message});
    });
});

module.exports = app;
