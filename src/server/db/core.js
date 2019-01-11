const bluebird = require('bluebird');

const connections = require('../config/connections');

const dbConstants = require('./dbConstants');

const Helper = require('../../utils/helper');

const couchUrl = `${connections.couchdb.ssl}://${connections.couchdb.username}:${connections.couchdb.password}@${connections.couchdb.host}:${connections.couchdb.port}`;
const nano = require('nano')(couchUrl);

bluebird.promisifyAll(nano);
bluebird.promisifyAll(nano.db);

let mainDB;

const createDesignDocsInDB = async (userDB, designDocs, callback) => {
  try {
    const ddocs = designDocs;
    const ids = ddocs.map(ddoc => ddoc._id);
    const result = await userDB.fetchRevsAsync({ keys: ids }, { include_docs: true });
    if (result && result.rows && result.rows.length > 0) {
      const insertDocs = [];
      result.rows.forEach((row, index) => {
        const oldDoc = row.doc || {};
        const newDoc = ddocs[index];
        if (!oldDoc.version || oldDoc.version !== newDoc.version) {
          insertDocs.push(Object.assign({}, oldDoc, newDoc));
        }
      });
      await userDB.bulkAsync({ docs: insertDocs }, {});
    }
    // console.log('createDesignDocsInDB', 'createDesignDocs', result);
    return Helper.asyncResponse(callback, null, true);
  } catch (e) {
    // Handle Error
    console.error('createDesignDocsInDB', 'createDesignDocs', e);
    return Helper.asyncResponse(callback, null, true);
  }
};


const initializeDB = async (dbName) => {
  try {
    await nano.db.getAsync(dbName);
    mainDB = nano.use(dbName);
    Helper.promisifyDB(mainDB);
    return mainDB;
  } catch (getDBError) {
    if (getDBError.status === 404 || getDBError.statusCode === 404) {
      try {
        mainDB = await nano.db.createAsync(dbName);
        mainDB = nano.use(dbName);
        Helper.promisifyDB(mainDB);
        return mainDB;
      } catch (createDBError) {
        console.error('createDBError', JSON.stringify(createDBError, null, 4));
        return createDBError; 
      }
    }
    return getDBError;
  }
};

const initializeMainDB = async (callback) => {
  try {
    if (mainDB) {
      return Helper.asyncResponse(callback, null, mainDB);
    }
    mainDB = await initializeDB(connections.couchdb.mainDB);
    const mainDBDesignDocs = dbConstants.getMainDBDesignDocs();
    await createDesignDocsInDB(mainDB, mainDBDesignDocs);
    return Helper.asyncResponse(callback, null, mainDB);
  } catch (error) {
    return Helper.asyncResponse(callback, null, error);
  }
};

module.exports = {
  initializeDB,
  initializeMainDB,
  nano
};