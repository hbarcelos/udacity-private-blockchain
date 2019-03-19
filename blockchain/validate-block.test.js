const Block = require('./block');
const subject = require('./validate-block');

describe('validate()', () => {
  it('Should throw when the block has an invalid height', () => {
    const previousBlock = Block({
      height: 22,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: 'dummy',
    });

    const block = Block({
      height: 30,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: previousBlock.hash,
    });

    expect(() => subject({ previousBlock, block })).toThrow();
  });

  it('Should throw when the block has an invalid hash', () => {
    const previousBlock = Block({
      height: 22,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: 'dummy',
    });

    const block = {
      height: 23,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: previousBlock.hash,
      hash: 'invalid hash',
    };

    expect(() => subject({ previousBlock, block })).toThrow();
  });

  it('Should throw when the block does not reference the previous block hash', () => {
    const previousBlock = Block({
      height: 22,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: 'dummy',
    });

    const block = Block({
      height: 23,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: 'dummy',
    });

    expect(() => subject({ previousBlock, block })).toThrow();
  });

  it('Should throw when block body is undefined', () => {
    const previousBlock = Block({
      height: 22,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: 'dummy',
    });

    const block = Block({
      height: 23,
      time: new Date(),
      previousBlockHash: previousBlock.hash,
    });

    expect(() => subject({ previousBlock, block })).toThrow();
  });

  it('Should throw an Error when both block or previousBlock are undefined', () => {
    expect(() => subject()).toThrow(/^Invalid block height/i);
  });

  it('Should throw when block is undefined', () => {
    const previousBlock = Block({
      height: 22,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: 'dummy',
    });

    expect(() => subject({ previousBlock })).toThrow(/^Invalid block height/i);
  });

  it('Should throw when previousBlock is undefined', () => {
    const block = Block({
      height: 22,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: 'dummy',
    });

    expect(() => subject({ previousBlock: block })).toThrow();
  });

  it('Should not throw when the block is valid', () => {
    const previousBlock = Block({
      height: 22,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: 'dummy',
    });

    const block = Block({
      height: 23,
      body: 'dummy',
      time: new Date(),
      previousBlockHash: previousBlock.hash,
    });

    expect(() => subject({ previousBlock, block })).not.toThrow();
  });
});
