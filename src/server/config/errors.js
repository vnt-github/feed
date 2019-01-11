const HTTPStatus = require('http-status');

const missingParam = (params) => {
  const missingParamsError = new Error(`missing argument ${params}`);
  missingParamsError.statusCode = HTTPStatus.BAD_REQUEST;
  return missingParamsError;
};

const invalidActionType = (actionType) => {
  const invalidTypeError = new Error(`please pass valid actionType, got: ${actionType} valid actionType: like, comment`);
  invalidTypeError.statusCode = HTTPStatus.BAD_REQUEST;
  return invalidTypeError;
};


module.exports = {
  missingParam,
  invalidActionType
};