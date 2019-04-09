const { Router } = require('express');
const { blockchain, Block } = require('../blockchain');
const verifyStarRegistration = require('./verify-start-registration.middleware');
const { toInputBlock, toOutputBlock } = require('./transformations');
const wrapError = require('./wrap-error');

module.exports = Router()
  .post(
    '/block',
    verifyStarRegistration,
    wrapError(async (req, res) => {
      const height = await blockchain.getBlockHeight();
      const previousBlock = await blockchain.getBlock(height);

      const { body } = req;
      const newBlock = Block(
        toInputBlock({
          body,
          time: new Date(),
          height: height + 1,
          previousBlockHash: previousBlock.hash,
        })
      );

      await blockchain.addBlock(newBlock);
      return res.json(toOutputBlock(newBlock));
    })
  )
  .get(
    '/block/:height',
    wrapError(async (req, res) => {
      const height = Number(req.params.height);

      const block = await blockchain.getBlock(height);
      return res.json(toOutputBlock(block));
    })
  );
