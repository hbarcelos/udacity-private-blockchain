const { toUnixTimestamp } = require('../utils/date');

function ValidationRequest({ address, createdAt, expiresAt }) {
  return Object.freeze({
    address,
    createdAt,
    expiresAt,
    message: `${address}:${toUnixTimestamp(createdAt)}:starRegistry`,
  });
}

module.exports = ValidationRequest;
