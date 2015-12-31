var rsvp = require('RSVP');
var $ = require('jquery');
var angular = require('angular');

module.exports = function(init) {
  var root = $('<div></div>');
  $(document.body).append(root);
  var app;
  var setup;
  var configuration;

  function stop() {
    app.stop();
    root.remove();
  }

  function wait(root) {
    return new rsvp.Promise(function(resolve) {
      angular.getTestability(root).whenStable(resolve);
    });
  }

  function visit(root, path) {
    var injector = angular.element(root).injector();
    injector.get('$location').path(path);
    injector.get('$route').reload();
  }

  function run(fn) {
    app = init(root, configuration);
    var operations = [];

    var dsl = {
      wait: function() {
        return wait(root);
      },
      andThen: function(fn) {
        var self = this;
        operations.push(function() {
          return self.wait().then(function() {
            return fn.bind(app)(root);
          });
        });
      },
      visit: function(path) {
        return this.andThen(function() {
          visit(root, path);
        });
      },
      click: function(selector, nth) {
        return this.andThen(function() {
          var $el = $(selector, root)[!!nth ? nth : 0];
          assert($el, 'Could not find element with selector ' + selector + ' to click.');
          $el.click();
        });
      },
      select: function(selector, value) {
        this.andThen(function() {
          var element = angular.element($(selector, root));
          element.val(value).change();
          if (element.scope()) {
            element.scope().$digest();
          }
        });
      }
    };
    dsl.verify = dsl.andThen;
    if (setup) {
      setup.apply(dsl);
    }
    fn.apply(dsl);

    app.start();
    var promise = operations.shift().apply(null);
    return operations.reduce(function(memo, op) {
      return memo.then(op);
    }, promise);
  }

  return {
    stop: stop,
    run: run
  };
};



