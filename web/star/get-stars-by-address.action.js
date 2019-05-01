const { blockchain } = require('../../blockchain');
const { toOutputBlock } = require('../transformations');
const wrapError = require('../wrap-error');

async function getStarsByAddress(req, res) {
  const { address } = req.params;

  const blocks = await blockchain.findBlocks(block => {
    const { body } = block;

    if (!body || Object(body) !== body) {
      return false;
    }

    return body.address === address;
  });

  return res.json(blocks.map(toOutputBlock));
}

module.exports = wrapError(getStarsByAddress);
