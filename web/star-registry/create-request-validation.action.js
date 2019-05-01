const { addRequestValidation } = require('../../mempool');
const ValidationRequest = require('../../mempool/validation-request');
const { toUnixTimestamp, toDuration, plus } = require('../../utils/date');
const wrapError = require('../wrap-error');

const validationRequestWindow =
  Number(process.env.VALIDATION_REQUEST_WINDOW) || 300;

async function createRequestValidation(req, res) {
  const currentDate = new Date();
  const requestedValidation = await addRequestValidation(
    ValidationRequest({
      ...req.body,
      createdAt: currentDate,
      expiresAt: plus({
        initial: currentDate,
        duration: { seconds: validationRequestWindow },
      }),
    })
  );

  return res.json({
    walletAddress: requestedValidation.address,
    requestTimeStamp: String(toUnixTimestamp(requestedValidation.createdAt)),
    message: requestedValidation.message,
    validationWindow: toDuration({
      end: requestedValidation.expiresAt,
      start: currentDate,
    }),
  });
}

module.exports = wrapError(createRequestValidation);
