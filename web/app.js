const express = require('express');
const bodyParser = require('body-parser');
const { blockchain, Block } = require('../blockchain');

const app = express();

app.use(bodyParser.json());

app.post('/block', async (req, res, next) => {
  try {
    const height = await blockchain.getBlockHeight();
    const previousBlock = await blockchain.getBlock(height);

    const { body } = req.body || {};
    const newBlock = Block({
      body,
      time: new Date(),
      height: height + 1,
      previousBlockHash: previousBlock.hash,
    });

    await blockchain.addBlock(newBlock);
    return res.json(newBlock);
  } catch (err) {
    return next(err);
  }
});

app.get('/block/:height', async (req, res, next) => {
  const height = Number(req.params.height);

  try {
    const block = await blockchain.getBlock(height);
    return res.json(block);
  } catch (err) {
    return next(err);
  }
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    const causeMixin = err.cause
      ? { cause: { message: err.cause.message } }
      : {};

    res.status(400).json({
      error: {
        message: err.message,
        code: err.code,
        ...causeMixin,
      },
    });
  }
});

module.exports = app;
