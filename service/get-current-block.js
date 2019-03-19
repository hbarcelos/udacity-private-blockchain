const { blockchain: blockchainImpl } = require('../blockchain');

function createGetCurrentBlock({ blockchain }) {
  return async function getCurrentBlock() {
    return blockchain.getBlock(await blockchain.getBlockHeight());
  };
}

module.exports = createGetCurrentBlock({ blockchain: blockchainImpl });
module.exports.createGetCurrentBlock = createGetCurrentBlock;
