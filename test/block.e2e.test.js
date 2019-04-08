const request = require('supertest');
const app = require('../web/app');

describe('Block Service', () => {
  describe('POST /block', () => {
    it('should return the a newly created block req.body.body is valid', async () => {
      const body = 'dummy';
      const response = await request(app)
        .post('/block')
        .send({ body });

      expect(response.status).toEqual(200);
      expect(response.body.height).toEqual(1);
    });

    it('should return an error when body param is missing', async () => {
      const response = await request(app).post('/block');

      expect(response.status).toEqual(422);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /block/:height when no block was inserted', () => {
    it('should return the genesis block when height is 0', async () => {
      const response = await request(app).get('/block/0');

      expect(response.status).toEqual(200);
      expect(response.body.height).toEqual(0);
    });

    it('should return an error when height param is higher than blockchain height', async () => {
      const response = await request(app).get('/block/281723');

      expect(response.status).toEqual(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
