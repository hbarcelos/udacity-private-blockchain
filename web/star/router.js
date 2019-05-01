const { Router } = require('express');
const getStarByBlockHash = require('./get-star-by-block-hash.action');
const getStarsByAddress = require('./get-stars-by-address.action');

module.exports = Router()
  .get('/hash::hash', getStarByBlockHash)
  .get('/address::address', getStarsByAddress);
