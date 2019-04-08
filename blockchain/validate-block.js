const Block = require('./block');
const errorCodes = require('./error-codes');

function hasValidHeight({ previousBlock, block }) {
  const expectedHeight = previousBlock.height + 1;
  if (block.height !== expectedHeight) {
    throw Object.assign(
      new Error(
        `Invalid block height. Expected ${expectedHeight}, given ${
          block.height
        }`
      ),
      { code: errorCodes.INVALID_BLOCK_HEIGHT }
    );
  }
}

function hasValidHash({ block }) {
  if (block.hash !== Block(block).hash) {
    throw Object.assign(new Error('The provided block hash is not valid'), {
      code: errorCodes.INVALID_BLOCK_HASH,
    });
  }
}

function hasValidBody({ block }) {
  if (block.body === undefined || block.body === null) {
    throw Object.assign(
      new Error(
        `The provided block body: "${JSON.stringify(block.body)}" is not valid`
      ),
      { code: errorCodes.MISSING_BLOCK_BODY }
    );
  }
}

function extendsChain({ previousBlock, block }) {
  if (previousBlock.hash !== block.previousBlockHash) {
    throw Object.assign(
      new Error('The provided block does not extend the current chain'),
      { code: errorCodes.INVALID_CHAIN }
    );
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
