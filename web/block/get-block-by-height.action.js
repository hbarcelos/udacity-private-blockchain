const { blockchain } = require('../../blockchain');
const { INVALID_BLOCK_HEIGHT } = require('../../blockchain/error-codes');
const { toOutputBlock } = require('../transformations');
const wrapError = require('../wrap-error');

async function getBlockByHeight(req, res) {
  const height = Number(req.params.height);

  if (Number.isNaN(height)) {
    throw Object.assign(new Error('Invalid block height'), {
      code: INVALID_BLOCK_HEIGHT,
      context: { height },
    });
  }

  const block = await blockchain.getBlock(height);
  return res.json(toOutputBlock(block));
}

module.exports = wrapError(getBlockByHeight);
