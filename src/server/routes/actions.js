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
    const { postId } = req.body;
    if (!postId) {
      throw errors.missingParam('postId');
    }
    const post = await mainDB.getAsync(postId);
    const options = { ...req.body, post };
    const actionDoc = Helper.generateActionsDoc(options);
    // const userCreateRes = await mainDB.insertAsync(actionDoc);
    post.weight += actionDoc.weight;
    console.log('post', post, true);
    const bulkPutRes = await mainDB.bulkAsync({ docs: [post, actionDoc] });
    return Helper.handleResponse(req, res, null, bulkPutRes);
  } catch (error) {
    if ((error.statusCode === 404 || error.status === 404)) {
      return Helper.handleResponse(req, res, new Error('invalid post'));
    }
    return Helper.handleResponse(req, res, error);
  }
});

router.put('/', async (req, res, next) => Helper.handleResponse(req, res, null, true));

router.delete('/', async (req, res, next) => Helper.handleResponse(req, res, null, true));

module.exports = router;
