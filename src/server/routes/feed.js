const express = require('express');

const Helper = require('../../utils/helper');

const errors = require('../config/errors');

const router = express.Router();

const db = require('../db');

const nano = require('../db').nano;

const dbConstants = require('../../server/db/dbConstants');

router.get('/', async (req, res, next) => {
  try {
    const mainDB = await db.initializeMainDB();
    const finalRes = await mainDB.viewAsync(dbConstants.FEED_ID, dbConstants.FEED_VIEW, { ...req.query, include_docs: true, descending: true });
    return Helper.handleResponse(req, res, null, finalRes.rows);
  } catch (error) {
    return Helper.handleResponse(req, res, error);
  }
});

module.exports = router;
