const { Router } = require('express');
const { blockchain } = require('../blockchain');
const wrapError = require('./wrap-error');
const { toOutputBlock } = require('./transformations');

module.exports = Router()
  .get(
    '/stars/hash::hash',
    wrapError(async (req, res) => {
      const block = await blockchain.findBlockByHash(req.params.hash);

      return res.json(toOutputBlock(block));
    })
  )
  .get(
    '/stars/address::address',
    wrapError(async (req, res) => {
      const { address } = req.params;

      const blocks = await blockchain.findBlocks(block => {
        const { body } = block;

        if (!body || Object(body) !== body) {
          return false;
        }

        return body.address === address;
      });

      return res.json(blocks.map(toOutputBlock));
    })
  );
