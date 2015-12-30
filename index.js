var TestHelpers = require('./lib/test-helpers');

module.exports = function(AngularApp) {
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

  function init(root, testSpecificConfig) {
    return new AngularApp(root, {}, function($provide) {});
  }

  return new TestHelpers(init, hooks);
};


