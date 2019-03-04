const validateBlockImpl = require('./validate-block');

function createSetBlockHeight({ storage }) {
  return async height => {
    return storage.add('currentHeight', height);
  };
}

function createGetBlockHeight({ storage }) {
  return async () => {
    const heightFromStorage = await storage.get('currentHeight');
    return heightFromStorage || 0;
  };
}

function createGetBlock({ storage }) {
  return async function getBlock(height) {
    if (height === 0) {
      return this.genesisBlock;
    }

    return storage.get(height);
  };
}

function createSyncGenesisBlock({ storage, genesisBlock, setBlockHeight }) {
  return async () => {
    const currentHeight = await storage.get('currentHeight');
    if (currentHeight === undefined) {
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
    validateBlock,
    validateChain,
    get genesisBlock() {
      return genesisBlock;
    },
  };
}

module.exports = createBlockchain;
