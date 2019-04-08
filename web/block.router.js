const { Router } = require('express');
const { blockchain, Block } = require('../blockchain');
const verifyStarRegistration = require('./verify-start-registration.middleware');
const { encodeStory, withDecodedStory } = require('./transformations');

module.exports = Router()
  .post('/block', verifyStarRegistration, async (req, res, next) => {
    try {
      const height = blockchain.getBlockHeight();
      const previousBlock = await blockchain.getBlock(height);

      const { body } = req;
      const newBlock = Block(
        encodeStory({
          body,
          time: new Date(),
          height: height + 1,
          previousBlockHash: previousBlock.hash,
        })
      );

      await blockchain.addBlock(newBlock);
      return res.json(withDecodedStory(newBlock));
    } catch (err) {
      return next(err);
    }
  })

  .get('/block/:height', async (req, res, next) => {
    const height = Number(req.params.height);

    try {
      const block = await blockchain.getBlock(height);
      return res.json(withDecodedStory(block));
    } catch (err) {
      return next(err);
    }
  });
