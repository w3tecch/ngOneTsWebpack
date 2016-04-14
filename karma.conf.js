// Reference: http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function karmaConfig (config) {
  config.set({

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      // Reference: https://github.com/karma-runner/karma-jasmine
      // Set framework to jasmine
      'mocha', 'chai', 'sinon'
    ],

    client: {
      args: ['--grep', config.grep || '']
    },

    // list of files to exclude
    exclude: [ ],

    reporters: [
      // Reference: https://github.com/mlex/karma-spec-reporter
      // Set reporter to print detailed results to console
      'spec',

      // Reference: https://github.com/karma-runner/karma-coverage
      // Output code coverage files
      'coverage'
    ],

    // list of files / patterns to load in the browser
    // we are building the test environment in ./spec-bundle.js
    files: [ { pattern: 'spec-bundle.js', watched: false } ],

    preprocessors: {
      // Reference: http://webpack.github.io/docs/testing.html
      // Reference: https://github.com/webpack/karma-webpack
      // Convert files with webpack and load sourcemaps
      'spec-bundle.js': ['webpack', 'sourcemap']
    },

    browsers: [
      // Run tests using PhantomJS
      'PhantomJS'
    ],

    autoWatch: true,
    singleRun: true,

    // Configure code coverage reporter
    coverageReporter: {
      dir: 'build/coverage/',
      type: 'html'
    },

    webpack: require('./webpack.test'),

    webpackMiddleware: {
      noInfo: true,
      stats: {
        // With console colors
        colors: true,
        // add the hash of the compilation
        hash: true,
        // add webpack version information
        version: false,
        // add timing information
        timings: true,
        // add assets information
        assets: true,
        // add chunk information
        chunks: true,
        // add built modules information to chunk information
        chunkModules: false,
        // add built modules information
        modules: false,
        // add also information about cached (not built) modules
        cached: true,
        // add information about the reasons why modules are included
        reasons: false,
        // add the source code of modules
        source: true,
        // add details to errors (like resolving log)
        errorDetails: true,
        // add the origins of chunks and chunk merging info
        chunkOrigins: true,
        // Add messages from child loaders
        children: false
      }
    }

  });
};

