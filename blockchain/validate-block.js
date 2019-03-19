const Block = require('./block');

function hasValidHeight({ previousBlock, block }) {
  const expectedHeight = previousBlock.height + 1;
  if (block.height !== expectedHeight) {
    throw new Error(
      `Invalid block height. Expected ${expectedHeight}, given ${block.height}`
    );
  }
}

function hasValidHash({ block }) {
  if (block.hash !== Block(block).hash) {
    throw new Error('The provided block hash is not valid');
  }
}

function hasValidBody({ block }) {
  if (block.body === undefined || block.body === null) {
    throw new Error(
      `The provided block body: "${JSON.stringify(block.body)}" is not valid`
    );
  }
}

function extendsChain({ previousBlock, block }) {
  if (previousBlock.hash !== block.previousBlockHash) {
    throw new Error('The provided block does not extend the current chain');
  }
}

function validateBlock({ previousBlock = {}, block = {} } = {}) {
  hasValidHeight({ previousBlock, block });
  hasValidHash({ previousBlock, block });
  hasValidBody({ previousBlock, block });
  extendsChain({ previousBlock, block });
}

module.exports = Object.assign(validateBlock, {
  hasValidHash,
});
