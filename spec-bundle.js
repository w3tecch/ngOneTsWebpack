/*
 Ok, this is kinda crazy. We can use the the context method on
 require that webpack created in order to tell webpack
 what files we actually want to require or import.
 Below, context will be an function/object with file names as keys.
 using that regex we are saying look in ./src/app and ./test then find
 any file that ends with spec.js and get its path. By passing in true
 we say do this recursively
 */
require('./src/app/app.ts');
require('angular-mocks');
var testsContext = require.context('./src/app', true, /.spec.ts$/);
testsContext.keys().forEach(testsContext);
