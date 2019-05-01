const { blockchain } = require('../../blockchain');
const { toOutputBlock } = require('../transformations');
const wrapError = require('../wrap-error');

async function getStarByBlockHash(req, res) {
  const block = await blockchain.findBlockByHash(req.params.hash);

  return res.json(toOutputBlock(block));
}

module.exports = wrapError(getStarByBlockHash);
