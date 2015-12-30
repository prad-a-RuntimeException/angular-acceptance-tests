var TestHelpers = require('./lib/test-helpers');

module.exports = function(angularApp) {
  window.location.hash = '';

  var hooks = {
    after: {
      visit: function(root) {
        return expect(root).to.be.accessible;
      },
      click: function(root) {
        return expect(root).to.be.accessible;
      }
    }
  };

  function init(root) {
    var app = function (root){
      return {
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
      }
    };
    return new app(root);
  }

  return new TestHelpers(init, hooks);
};


