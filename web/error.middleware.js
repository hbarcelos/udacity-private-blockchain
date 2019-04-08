const blockchainErrors = require('../blockchain/error-codes');
const mempoolErrors = require('../mempool/error-codes');

const errorCodeToHTTPStatusMap = {
  [blockchainErrors.BLOCK_NOT_FOUND]: 404,
  [blockchainErrors.INVALID_BLOCK_HASH]: 422,
  [blockchainErrors.INVALID_BLOCK_HEIGHT]: 422,
  [blockchainErrors.INVALID_CHAIN]: 422,
  [blockchainErrors.MISSING_BLOCK_BODY]: 422,
  [blockchainErrors.UNKNOWN]: 500,
  [mempoolErrors.FAILED_ADDRESS_VALIDATION]: 422,
  [mempoolErrors.INVALID_SIGNATURE]: 403,
  [mempoolErrors.SIGNATURE_EXPIRED]: 410,
  [mempoolErrors.VALIDATION_REQUEST_EXPIRED]: 410,
  [mempoolErrors.VALIDATION_REQUEST_NOT_FOUND]: 404,
};

const toHTTPStatus = code => errorCodeToHTTPStatusMap[code] || 500;

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (!res.headersSent) {
    const causeMixin = err.cause
      ? { cause: { message: err.cause.message } }
      : {};

    res.status(toHTTPStatus(err.code)).json({
      error: {
        message: err.message,
        code: err.code,
        ...causeMixin,
      },
    });
  }
};
