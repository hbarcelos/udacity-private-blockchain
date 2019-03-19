const Block = require('./block');
const subject = require('./create-blockchain');

describe('Blockchain', () => {
  const storage = {
    add: jest.fn(),
    get: jest.fn(),
  };
  const genesisBlock = Block({
    height: 0,
    time: new Date('2019-01-01T00:00:00.000Z'),
    body: 'dummy',
    previousBlockHash: null,
  });

  let instance;

  beforeEach(() => {
    instance = subject({ storage, genesisBlock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('.genesisBlock', () => {
    it('should hold a reference to its genesis block', () => {
      expect(instance.genesisBlock).toEqual(genesisBlock);
    });
  });

  describe('.syncGenesisBlock()', () => {
    it('should store height and genesis block into storage when it is emtpy', async () => {
      storage.get.mockRejectedValueOnce(new Error('dummy'));

      await instance.syncGenesisBlock();

      expect(storage.add).toHaveBeenCalledWith('currentHeight', 0);
      expect(storage.add).toHaveBeenCalledWith(0, genesisBlock);
    });

    it('should not store height and genesis block into storage when it already has data', async () => {
      storage.get.mockResolvedValueOnce(9123129);

      await instance.syncGenesisBlock();

      expect(storage.add).not.toHaveBeenCalled();
    });
  });

  describe('.addBlock()', () => {
    it('should store the block with its .height as key', async () => {
      const newBlock = Block({
        height: 1,
        body: 'dummy',
        time: new Date(),
        previousBlockHash: genesisBlock.hash,
      });

      instance.getBlock = jest.fn();
      instance.getBlock.mockResolvedValueOnce(genesisBlock);

      await instance.addBlock(newBlock);

      expect(storage.add).toHaveBeenCalledWith(newBlock.height, newBlock);
    });

    it('should store the block along side the genesis block when it is not synced', async () => {
      const newBlock = Block({
        height: 1,
        body: 'dummy',
        time: new Date(),
        previousBlockHash: genesisBlock.hash,
      });

      instance.getBlock = jest.fn();
      instance.getBlock.mockResolvedValueOnce(genesisBlock);
      instance.syncGenesisBlock = jest.fn();

      await instance.addBlock(newBlock);

      expect(storage.add).toHaveBeenCalledWith(newBlock.height, newBlock);
      expect(instance.syncGenesisBlock).toHaveBeenCalledTimes(1);
    });

    it('should throw if trying to insert an invalid block', async () => {
      const newBlock = {
        height: 1,
        body: 'dummy',
        time: new Date(),
        previousBlockHash: genesisBlock.hash,
        hash: 'dummy hash',
      };

      instance.getBlock = jest.fn();
      instance.getBlock.mockResolvedValueOnce(genesisBlock);

      await expect(instance.addBlock(newBlock)).rejects.toThrow();
    });
  });

  describe('.getBlockHeight()', () => {
    it('should return the `currentHeight` key from storage', async () => {
      const currentHeight = 9831893;
      storage.get.mockResolvedValueOnce(currentHeight);

      const result = await instance.getBlockHeight();

      expect(result).toEqual(currentHeight);
    });
  });

  describe('.getBlock()', () => {
    it('should return the genesis block height = 0', async () => {
      const result = await instance.getBlock(0);

      expect(result).toEqual(genesisBlock);
    });

    it('should return block for the given height', async () => {
      const height = 8172381;
      const block = Block({
        height,
        body: 'dummy',
        time: new Date(),
        previousBlockHash: 'dummy',
      });

      storage.get.mockResolvedValue(block);

      const result = await instance.getBlock(height);

      expect(result).toEqual(block);
    });

    it('should throw when storage rejects', async () => {
      const height = 8172381;
      const error = new Error('not found');

      storage.get.mockRejectedValue(error);

      expect(instance.getBlock(height)).rejects.toThrow();
    });
  });

  describe('.validateBlock()', () => {
    it('should return true if the block is valid', async () => {
      const height = 8172281;
      const block = Block({
        height,
        body: 'dummy',
        time: new Date(),
        previousBlockHash: 'dummy',
      });

      storage.get.mockResolvedValue(block);

      const result = await instance.validateBlock(height);

      expect(result).toEqual(true);
    });

    it('should return false if the block is invalid', async () => {
      const height = 8172381;
      const block = {
        height,
        body: 'dummy',
        time: new Date(),
        previousBlockHash: 'dummy',
        hash: 'invalid',
      };

      storage.get.mockResolvedValue(block);

      const result = await instance.validateBlock(height);

      expect(result).toEqual(false);
    });

    it('should return false if the block at height = 0 is different from the genesis block', async () => {
      const height = 0;
      const anotherGenesis = Block({
        height,
        body: 'dummy',
        time: new Date(),
        previousBlockHash: null,
      });

      instance.getBlock = jest.fn();
      instance.getBlock.mockResolvedValueOnce(anotherGenesis);

      const result = await instance.validateBlock(height);

      expect(result).toEqual(false);
    });
  });

  describe('.validateChain()', () => {
    it('should return true if all blocks are valid', async () => {
      instance.getBlockHeight = jest.fn();
      instance.validateBlock = jest.fn();

      instance.getBlockHeight.mockResolvedValue(3);
      instance.validateBlock
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);

      const result = await instance.validateChain();

      expect(result).toBe(true);
    });

    it('should return false if one of the blocks are invalid', async () => {
      instance.getBlockHeight = jest.fn();
      instance.validateBlock = jest.fn();

      instance.getBlockHeight.mockResolvedValue(3);
      instance.validateBlock
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const result = await instance.validateChain();

      expect(result).toBe(false);
    });
  });
});
