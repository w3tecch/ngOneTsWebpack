/**
 * Webpack config for development
 */

const helpers = require(process.cwd() + '/webpack.helpers.js');

module.exports = require('./webpack.make')({
  BUILD: false,
  TEST: false,
  PUBLICPATH: 'http://' + helpers.getMetadata().host + ':' + helpers.getMetadata().port + '/'
});
