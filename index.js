var TestHelpers = require('./lib/test-helpers');

module.exports = function(appName, appBootstrap, indexHtml) {
  window.location.hash = "";



  function init(root, testSpecificConfig) {
    return {
      start: function start() {
        angular.element(root).append(indexHtml);
        appBootstrap(appName);
        this.injector = angular.bootstrap(root, [appName]);
      },
      stop: function stop() {
        var $rootScope = this.injector.get('$rootScope');
        $rootScope.$destroy();
      }
    };
  }

  return new TestHelpers(init);
};


