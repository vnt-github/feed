const express = require('express');

const Helper = require('../../utils/helper');

const errors = require('../config/errors');

const router = express.Router();

const db = require('../db');

const nano = require('../db').nano;

router.get('/', async (req, res, next) => Helper.handleResponse(req, res, null, true));

router.post('/', async (req, res, next) => {
  try {
    const mainDB = await db.initializeMainDB();
    const { name } = req.body;
    if (!name) {
      throw errors.missingParam('name');
    }
    const userCreateRes = await mainDB.insertAsync({ name });
    return Helper.handleResponse(req, res, null, userCreateRes);
  } catch (error) {
    return Helper.handleResponse(req, res, error);
  }
});

router.put('/', async (req, res, next) => Helper.handleResponse(req, res, null, true));

router.delete('/', async (req, res, next) => Helper.handleResponse(req, res, null, true));

module.exports = router;
