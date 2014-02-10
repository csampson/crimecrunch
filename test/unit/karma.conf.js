module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular.min.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular-mocks.js',
      'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js',
      '../../public/**/*.js',
      '../../test/**/*.js'
    ],

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    captureTimeout: 60000,

    singleRun: false
  });
};
