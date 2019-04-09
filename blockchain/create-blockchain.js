const validateBlockImpl = require('./validate-block');
const { BLOCK_NOT_FOUND, UNKNOWN } = require('./error-codes');

function createSetBlockHeight({ storage }) {
  return async height => {
    return storage.add('currentHeight', height);
  };
}

function createGetBlockHeight({ storage }) {
  return async () => {
    try {
      return await storage.get('currentHeight');
    } catch (err) {
      if (err.code === 'NotFoundError') {
        return 0;
      }

      throw Object.assign(new Error('Problem getting current block height'), {
        code: UNKNOWN,
        cause: err,
      });
    }
  };
}

function createGetBlock({ storage }) {
  return async function getBlock(height) {
    if (height === 0) {
      return this.genesisBlock;
    }

    try {
      return await storage.get(height);
    } catch (err) {
      throw Object.assign(
        new Error(`Block at height ${height} does not exist`),
        {
          code: BLOCK_NOT_FOUND,
          cause: err,
        }
      );
    }
  };
}

async function findBlockByHash(hash, height = 0) {
  try {
    const block = await this.getBlock(height);

    if (block.hash === hash) {
      return block;
    }

    return this.findBlockByHash(hash, height + 1);
  } catch (err) {
    if (err.code !== BLOCK_NOT_FOUND) {
      throw err;
    }

    throw Object.assign(
      new Error(`Could not find block with hash "${hash}".`),
      {
        code: BLOCK_NOT_FOUND,
      }
    );
  }
}

async function findBlocks(condition, height = 0, acc = []) {
  try {
    const block = await this.getBlock(height);

    return condition(block)
      ? this.findBlocks(condition, height + 1, acc.concat(block))
      : this.findBlocks(condition, height + 1, acc);
  } catch (err) {
    if (err.code !== BLOCK_NOT_FOUND) {
      throw err;
    }

    return acc;
  }
}

function createSyncGenesisBlock({ storage, genesisBlock, setBlockHeight }) {
  return async () => {
    try {
      await storage.get('currentHeight');
    } catch (err) {
      await Promise.all([setBlockHeight(0), storage.add(0, genesisBlock)]);
    }
  };
}

function createAddBlock({ storage, setBlockHeight }) {
  return async function addBlock(block) {
    await this.syncGenesisBlock();
    const previousBlock = await this.getBlock(await this.getBlockHeight());
    validateBlockImpl({ previousBlock, block });

    return Promise.all([
      setBlockHeight(block.height),
      storage.add(block.height, block),
    ]);
  };
}

async function validateBlock(height) {
  const block = await this.getBlock(height);

  if (height === 0 && block.hash !== this.genesisBlock.hash) {
    return false;
  }

  try {
    validateBlockImpl.hasValidHash({ block });
    return true;
  } catch (err) {
    return false;
  }
}

async function validateChain(startAt = 0) {
  const currentHeight = await this.getBlockHeight();
  if (startAt > currentHeight) {
    return true;
  }

  if ((await this.validateBlock(startAt)) === false) {
    return false;
  }

  return this.validateChain(startAt + 1);
}

function createBlockchain({ storage, genesisBlock }) {
  const setBlockHeight = createSetBlockHeight({ storage });
  const syncGenesisBlock = createSyncGenesisBlock({
    storage,
    genesisBlock,
    setBlockHeight,
  });
  const addBlock = createAddBlock({ storage, setBlockHeight });
  const getBlock = createGetBlock({ storage });
  const getBlockHeight = createGetBlockHeight({ storage });

  return {
    syncGenesisBlock,
    addBlock,
    getBlockHeight,
    getBlock,
    findBlockByHash,
    findBlocks,
    validateBlock,
    validateChain,
    get genesisBlock() {
      return genesisBlock;
    },
  };
}

module.exports = createBlockchain;
