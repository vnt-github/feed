const bluebird = require('bluebird');
const uuid = require('uuid');
const errors = require('../server/config/errors');
const constants = require('../server/config/constants');

const asyncResponse = function (callbackFunc, err, data) {
  if (typeof callbackFunc === 'function') {
    callbackFunc(err, data);
  }
  if (err) {
    return Promise.reject(err);
  }
  return Promise.resolve(data);
};

const sendResponse = function (promiseFunc, callbackFunc, err, data) {
  if (err) {
    err.status = err.status || err.statusCode;
    err.statusCode = err.statusCode || err.status;
    if (typeof callbackFunc === 'function') {
      callbackFunc(err);
    } else {
      promiseFunc(err);
    }
    return;
  }
  if (typeof callbackFunc === 'function') {
    callbackFunc(null, data);
  } else {
    promiseFunc(data);
  }
};

const handleResponse = function (req, res, err, response) {
  if (err) {
    return res.json({
      status: 'error',
      ok: false,
      code: err.statusCode || 400,
      message: err.message || err,
      result: err.message
    });
  }
  return res.json({
    status: 'success',
    ok: true,
    code: 200,
    message: '',
    result: response,
  });
};

const promisifyDB = function (db, callback) {
  return new Promise((resolve, reject) => {
    Promise.all([bluebird.promisifyAll(db), bluebird.promisifyAll(db.attachment), bluebird.promisifyAll(db.multipart)])
      .then(results => this.sendResponse(resolve, callback, null, results))
      .catch(err => this.sendResponse(reject, callback, err));
  });
};

const generatePostDoc = function (text) {
  const currentDate = Date.now();
  return {
    _id: `${constants.types.POST}_${uuid.v4()}`,
    text,
    '@type': constants.types.POST,
    dateCreated: currentDate,
    weight: currentDate
  };
};

const getWeightFromActionType = function (_type) {
  const type = _type.toLowerCase();
  switch (type) {
    case 'like':
      return 10000;
    case 'comment':
      return 20000;
    default:
      throw errors.invalidActionType(type);
  }
};

const generateActionsDoc = function (options) {
  const {
    actionType,
    post
  } = options;
  if (!actionType) {
    throw errors.missingParam('actionType');
  } else if (!post) {
    throw errors.missingParam('post');
  } else if (!post.dateCreated) {
    throw errors.missingParam('post.dateCreated');
  } else if (!post._id) {
    throw errors.missingParam('post._id');
  }
  const weight = getWeightFromActionType(actionType);
  const finalPost = {
    _id: post._id,
    dateCreated: post.dateCreated
  };
  return {
    _id: `${constants.types.ACTION}_${uuid.v4()}`,
    '@type': constants.types.ACTION,
    category: actionType,
    weight,
    post: finalPost,
    dateCreated: Date.now()
  };
};


module.exports = {
  asyncResponse,
  handleResponse,
  promisifyDB,
  sendResponse,
  generatePostDoc,
  generateActionsDoc,
  getWeightFromActionType
};