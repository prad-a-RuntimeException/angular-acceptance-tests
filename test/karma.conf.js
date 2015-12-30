module.exports = function(config){
  config.set({
    basePath : './',
    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      '../angular-acceptance-tests/index.js',
      '../angular-acceptance-tests/lib/*.js',
      'spec/*.js',
      'app/components/**/*.js',
      'app/view*/**/*.js',
      'app/app.js',
      'app/*.html',
    ],
    autoWatch : true,

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-browserify',
      'karma-junit-reporter'
    ],
    frameworks: ['jasmine', 'browserify'],
    browserify: {
      debug: true
    },
    preprocessors: {
      'angular-acceptance-tests/**/*.js': ['browserify'],
      'spec/example_spec.js': ['browserify']
    },

    logLevel: config.LOG_ERROR,
    browsers : ['Chrome']
  });
};
