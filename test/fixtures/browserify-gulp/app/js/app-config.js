'use strict';
var angular = require('angular');


module.exports = function(root) {
  function bindServices(appName) {
    appName = appName || 'todoApp';
    require('es5-shim');
    require('es5-sham');

    require('jquery');
    require('angular-route');

    var app = angular.module(appName, ['ngRoute']);

    app.constant('VERSION', require('../../package.json').version);

    require('./service');
    require('./controller');

    app.config(function($routeProvider) {

      $routeProvider.when('/todos', {
        template: require('../views/todos.html'),
        controller: 'TodoCtrl'
      })
        .when('/imprint', {
          template: require('../views/imprint.html'),
          controller: 'ImprintCtrl'
        })
        .otherwise({
          redirectTo: '/todos'
        });
    });
  }
  return {
    bindServices: bindServices
  };
};

