const { toUnixTimestamp } = require('./date-utils');

function ValidationRequest({ address, createdAt, expiresAt }) {
  return Object.freeze({
    address,
    createdAt,
    expiresAt,
    message: `${address}:${toUnixTimestamp(createdAt)}:starRegistry`,
  });
}

module.exports = ValidationRequest;
