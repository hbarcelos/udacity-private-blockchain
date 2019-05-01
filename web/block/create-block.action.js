const { blockchain, Block } = require('../../blockchain');
const { toInputBlock, toOutputBlock } = require('../transformations');
const wrapError = require('../wrap-error');

async function createBlock(req, res) {
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
}

module.exports = wrapError(createBlock);
