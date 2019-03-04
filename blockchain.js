const realGenesisBlock = require('./genesis-block');
const levelDbStorage = require('./level-storage');
const createBlockchain = require('./create-blockchain');

module.exports = Object.freeze(
  createBlockchain({
    storage: levelDbStorage,
    genesisBlock: realGenesisBlock,
  })
);
