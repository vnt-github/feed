const express = require('express');

const Helper = require('../../utils/helper');

const router = express.Router();

const db = require('../db');

const nano = require('../db').nano;

router.get('/', async (req, res, next) => {
  return Helper.handleResponse(req, res, null, true);
});

router.post('/', async (req, res, next) => {
  try {
    const mainDB = await db.initializeMainDB();
    const postCreateRes = await mainDB.insertAsync(Helper.generatePostDoc(req.body));
    return Helper.handleResponse(req, res, null, postCreateRes);
  } catch (error) {
    return Helper.handleResponse(req, res, error);
  }
});

router.put('/', async (req, res, next) => {
  return Helper.handleResponse(req, res, null, true);
});

router.delete('/', async (req, res, next) => {
  return Helper.handleResponse(req, res, null, true);
});

module.exports = router;