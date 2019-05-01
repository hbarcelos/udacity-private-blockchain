const { Router } = require('express');
const createRequestValidation = require('./create-request-validation.action');
const validateMessageSignature = require('./validate-message-signature.action');

module.exports = Router()
  .post('/requestValidation', createRequestValidation)
  .post('/message-signature/validate', validateMessageSignature);
