const level = require('level');

const { BLOCKCHAIN_DATA_STORAGE_DIRECTORY = './chaindata' } = process.env;
const db = level(BLOCKCHAIN_DATA_STORAGE_DIRECTORY);

async function add(key, data) {
  return db.put(key, JSON.stringify(data));
}

async function get(key) {
  try {
    const data = await db.get(key);
    return JSON.parse(data);
  } catch (err) {
    if (err.type) {
      err.code = err.type;
    }

    throw err;
  }
}

module.exports = {
  add,
  get,
};
