const storage = require('../storage/level');
const genesisBlock = require('./genesis-block');
const createBlockchain = require('./create-blockchain');

module.exports = Object.freeze(
  createBlockchain({
    storage,
    genesisBlock,
  })
);
