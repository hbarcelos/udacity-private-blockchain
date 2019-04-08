const { Router } = require('express');
const { blockchain } = require('../blockchain');
const wrapError = require('./wrap-error');
const { withDecodedStory } = require('./transformations');

module.exports = Router().get(
  '/stars/hash::hash',
  wrapError(async (req, res) => {
    const block = await blockchain.findBlockByHash(req.params.hash);

    return res.json(withDecodedStory(block));
  })
);
