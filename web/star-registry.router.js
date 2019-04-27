const { Router } = require('express');
const { addRequestValidation, validateRequestByWallet } = require('../mempool');
const { toUnixTimestamp, toDuration, plus } = require('../utils/date');
const ValidationRequest = require('../mempool/validation-request');
const wrapError = require('./wrap-error');

const validationRequestWindow = Number(process.env.VALIDATION_REQUEST_WINDOW) || 300;
const validationExpiration = Number(process.env.VALIDATION_EXPIRATION) || 1800;

module.exports = Router()
  .post(
    '/requestValidation',
    wrapError(async (req, res) => {
      const currentDate = new Date();
      const requestValidation = await addRequestValidation(
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
        walletAddress: requestValidation.address,
        requestTimeStamp: String(toUnixTimestamp(requestValidation.createdAt)),
        message: requestValidation.message,
        validationWindow: toDuration({
          end: requestValidation.expiresAt,
          start: currentDate,
        }),
      });
    })
  )
  .post(
    '/message-signature/validate',
    wrapError(async (req, res) => {
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
    })
  );
