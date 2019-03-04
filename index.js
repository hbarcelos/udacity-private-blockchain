const assert = require('assert');
const Block = require('./block');
const blockchain = require('./blockchain');
const levelStorage = require('./level-storage');

async function createBlock() {
  const currentHeight = await blockchain.getBlockHeight();
  const currentBlock = await blockchain.getBlock(currentHeight);
  const newBlock = Block({
    height: currentHeight + 1,
    time: new Date(),
    body: 'dummy',
    previousBlockHash: currentBlock.hash,
  });

  await blockchain.addBlock(newBlock);
}

async function invalidateBlock(height) {
  const block = await blockchain.getBlock(height);
  const invalidBlock = {
    ...block,
    body: `this was changed! ${new Date()}`,
  };
  await levelStorage.add(height, invalidBlock);
}

(async () => {
  for (let i = 0; i < 200; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await createBlock();
  }

  const isValidBefore = await blockchain.validateChain();
  assert.equal(isValidBefore, true);

  await Promise.all([4, 7, 20].map(invalidateBlock));

  const isValidAfter = await blockchain.validateChain();
  assert.equal(isValidAfter, false);
})();
