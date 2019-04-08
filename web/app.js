const express = require('express');
const bodyParser = require('body-parser');
const blockRouter = require('./block.router');
const startRegistryRouter = require('./star-registry.router');
const starRouter = require('./star.router');
const errorMiddleware = require('./error.middleware');

const app = express();

app.use(bodyParser.json());
app.use(blockRouter);
app.use(startRegistryRouter);
app.use(starRouter);
app.use(errorMiddleware);

module.exports = app;
