var $ = require('jquery');
var testHelpers = require('../lib/test-helpers');
module.exports = function() {


  var app;
  var root;

  function init(angularApp, components) {
    root = $('<div></div>');
    app = {
      injector: null,
      start: function() {
        this.injector = angular.bootstrap(root, [angularApp]);
      },
      stop: function() {

        if (this.injector) {
          var $rootScope = this.injector.get('$rootScope');
          $rootScope.$destroy();
        } else {
          console.log('WARNING:', 'No App found to destroy');
        }
      }
    };
  }

  function destroy() {
    app.stop();
    root.remove();
  }


  function setupStubs($provide, componentsToMock) {
    function spy($delegate) {
      Object.getOwnPropertyNames($delegate)
        .filter(function(key) {
          return typeof ($delegate[key]) === 'function';
        }).reduce(function(mem, curr) {
        mem[curr] = $delegate[curr]; return mem;
      }, {});
    }
    componentsToMock.forEach(function(component) {
      $provide.decorator(component, spy);
    });

  }

  function run(fn) {
    testHelpers(app, root)(fn);
  }

  return {
    init: init,
    run: run,
    destroy: destroy
  };

};
