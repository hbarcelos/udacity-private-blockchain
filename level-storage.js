const level = require('level');

const chainDB = './chaindata';
const db = level(chainDB);

async function add(key, data) {
  return db.put(key, JSON.stringify(data));
}

async function get(key) {
  try {
    const data = await db.get(key);
    return JSON.parse(data);
  } catch (err) {
    if (err.type === 'NotFoundError') {
      return undefined;
    }

    throw err;
  }
}

module.exports = {
  add,
  get,
};
