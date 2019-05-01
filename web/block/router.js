const { Router } = require('express');
const verifyStarRegistration = require('../star-registry/verify-registration.middleware');
const createBlock = require('./create-block.action');
const getBlockByHeight = require('./get-block-by-height.action');

module.exports = Router()
  .post('/', verifyStarRegistration, createBlock)
  .get('/:height', getBlockByHeight);
