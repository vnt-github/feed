/* eslint prefer-arrow-callback: "off" */
/* eslint no-var: "off" */
/* eslint vars-on-top: "off" */
/* eslint prefer-destructuring: "off" */
/* eslint prefer-template: "off" */
/* eslint no-undef: "off" */

const actionsView = () => function (doc) {
  if (doc['@type'] === 'post') {
    emit([doc.weight]);
  }
}.toString();

const DBConstants = {
  FEED_ID: 'posts',
  FEED_VIEW: 'by_ranking',
  VIEW_VERSION: 1,
  getMainDBDesignDocs: () => {
    const ddocs = [];
    ddocs.push({
      _id: `_design/${DBConstants.FEED_ID}`,
      version: DBConstants.VIEW_VERSION,
      autoBuild: 10000,
      views: {
        [DBConstants.FEED_VIEW]: {
          map: actionsView()
        }
      }
    });
    return ddocs;
  }
};

module.exports = DBConstants;