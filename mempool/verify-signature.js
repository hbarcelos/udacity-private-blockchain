const { verify } = require('bitcoinjs-message');
const { INVALID_SIGNATURE } = require('./error-codes');

function verifySignature({ message, address, signature }) {
  if (!verify(message, address, signature)) {
    throw Object.assign(new Error('Invalid signature'), {
      code: INVALID_SIGNATURE,
    });
  }
}

module.exports = verifySignature;
