
module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/browserified/browserified_tests.js'
    ],
    exclude: [],
    preprocessors: {
    },

    reporters: ['progress'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],

    singleRun: false
  });
};
