const SHA256 = require('crypto-js/sha256');

function Block({ height, body, time, previousBlockHash }) {
  return Object.freeze({
    hash: SHA256(
      JSON.stringify({ height, body, time, previousBlockHash })
    ).toString(),
    height,
    body,
    time,
    previousBlockHash,
  });
}

module.exports = Block;
