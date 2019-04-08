const request = require('supertest');
const app = require('../web/app');

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    }
    return {
      message: () =>
        `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass: false,
    };
  },
});

describe('Notary Star Service', () => {
  describe('POST /requestValidation', () => {
    it('should create a new validation request for a given address', async () => {
      const address = '2MtjEbMARCwtE18hqeFT4B84MeJTpkUXpb2';

      const response = await request(app)
        .post('/requestValidation')
        .send({ address });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        walletAddress: address,
        message: expect.stringMatching(
          new RegExp(`^${address}:\\d+:starRegistry$`)
        ),
        validationWindow: expect.toBeWithinRange(0, 300),
        requestTimeStamp: expect.stringMatching(/^\d+$/),
      });
    });
  });
});
