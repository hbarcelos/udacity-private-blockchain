function SucceededVerification({ address, createdAt, expiresAt, message }) {
  return Object.freeze({
    address,
    createdAt,
    expiresAt,
    message,
  });
}

module.exports = SucceededVerification;
