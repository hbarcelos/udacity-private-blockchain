const { verifyAddressRequest } = require('../mempool');
const wrapError = require('./wrap-error');

const verifyStarRegistration = wrapError(async (req, res, next) => {
  const currentDate = new Date();

  const { address, star } = req.body;
  if (!address || !star) {
    // This is not a star registration, so we can bypass the verification
    return next();
  }

  await verifyAddressRequest({ address, verifiedAt: currentDate });
  return next();
});

module.exports = verifyStarRegistration;
