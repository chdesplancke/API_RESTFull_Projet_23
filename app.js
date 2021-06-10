"use strict";
const express = require('express');
const bodyParser = require('body-parser');
let port = process.env.PORT || 3000;

const app = express();
const authRouter = require('./routes/auth');
const sensorsRouter = require('./routes/sensors');
const statsRouter = require('./routes/stats');

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(allowCrossDomain);

app.use('/auth', authRouter);
app.use('/sensors', sensorsRouter);
app.use('/stats', statsRouter);

let server = app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});

module.exports = {
    app,
}