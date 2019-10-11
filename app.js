var express = require('express');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

function defaultContentTypeMiddleware(req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}
app.use(defaultContentTypeMiddleware);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.set('Access-Control-Allow-Headers', 'U-ApiKey, Content-Type');
    //res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' === req.method) return res.status(200).end();
    next();
});

app.use('/', indexRouter);

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
    res.json({ ok: 0, n: 0, err: err.message });
});

module.exports = app;
