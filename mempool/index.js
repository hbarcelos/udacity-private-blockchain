const process = require('process');
const createMempool = require('./create-mempool');
const InMemoryStorage = require('./storage/in-memory');
const CancelableDelay = require('./cancelable-delay');

const validationRequestWindow = Number(process.env.VALIDATION_REQUEST_WINDOW);
const validationExpiration = Number(process.env.VALIDATION_EXPIRATION);

module.exports = createMempool({
  storage: {
    valid: InMemoryStorage({
      cancelableDelay: CancelableDelay(validationExpiration),
    }),
    pending: InMemoryStorage({
      cancelableDelay: CancelableDelay(validationRequestWindow),
    }),
  },
});
