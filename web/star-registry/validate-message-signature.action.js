const { validateRequestByWallet } = require('../../mempool');
const { toUnixTimestamp, toDuration, plus } = require('../../utils/date');
const wrapError = require('../wrap-error');

const validationExpiration = Number(process.env.VALIDATION_EXPIRATION) || 1800;

async function validateMessageSignature(req, res) {
  const currentDate = new Date();
  const succeededVerification = await validateRequestByWallet({
    ...req.body,
    createdAt: currentDate,
    expiresAt: plus({
      initial: currentDate,
      duration: { seconds: validationExpiration },
    }),
  });

  return res.json({
    registerStar: true,
    status: {
      address: succeededVerification.address,
      requestTimeStamp: String(
        toUnixTimestamp(succeededVerification.createdAt)
      ),
      message: succeededVerification.message,
      validationWindow: toDuration({
        end: succeededVerification.expiresAt,
        start: currentDate,
      }),
      messageSignature: true,
    },
  });
}

module.exports = wrapError(validateMessageSignature);
