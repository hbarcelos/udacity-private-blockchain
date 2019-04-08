const SucceededVerification = require('./validation-request');
const verifySignature = require('./verify-signature');
const hasTimeLeft = require('./has-time-left');
const errorCodes = require('./error-codes');

function createMempool({ storage: { pending, valid } }) {
  return {
    async addRequestValidation({ address, ...rest }) {
      return pending.set(address, { address, ...rest });
    },
    async verifyAddressRequest({ address, verifiedAt }) {
      const verification = await valid.get(address);

      if (!verification) {
        throw Object.assign(new Error('Could not verify the address'), {
          code: errorCodes.FAILED_ADDRESS_VALIDATION,
        });
      }

      if (
        !hasTimeLeft({
          expiresAt: verification.expiresAt,
          verifiedAt,
        })
      ) {
        throw Object.assign(new Error('Signature expired'), {
          code: errorCodes.SIGNATURE_EXPIRED,
        });
      }

      await valid.del(address);

      return verification;
    },
    async validateRequestByWallet({
      address,
      signature,
      createdAt,
      expiresAt,
    }) {
      const requestValidation = await pending.get(address);

      if (!requestValidation) {
        throw Object.assign(new Error(`Could not find a request validation`), {
          code: errorCodes.VALIDATION_REQUEST_NOT_FOUND,
        });
      }

      await verifySignature({
        message: requestValidation.message,
        address,
        signature,
      });

      if (
        !hasTimeLeft({
          expiresAt: requestValidation.expiresAt,
          verifiedAt: createdAt,
        })
      ) {
        throw Object.assign(new Error('Validation request expired'), {
          code: errorCodes.VALIDATION_REQUEST_EXPIRED,
        });
      }

      await pending.del(address);

      return valid.set(
        address,
        SucceededVerification({
          message: requestValidation.message,
          createdAt,
          expiresAt,
          address,
        })
      );
    },
  };
}

module.exports = createMempool;
