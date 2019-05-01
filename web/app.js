const express = require('express');
const bodyParser = require('body-parser');
const blockRouter = require('./block/router');
const starRegistryRouter = require('./star-registry/router');
const starRouter = require('./star/router');
const errorMiddleware = require('./error.middleware');

const app = express();

app.use(bodyParser.json());
app.use(starRegistryRouter);
app.use('/block', blockRouter);
app.use('/stars', starRouter);
app.use(errorMiddleware);

module.exports = app;
