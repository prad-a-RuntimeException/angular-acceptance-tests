var promise = require('Promise');
var angular = require('angular');
var $ = require('jquery');

module.exports = function(app, root) {

  function routeTo(path, injector) {
    injector.get('$location').path(path);
    injector.get('$route').reload();
  }

  function visit(root, path) {
    var injector = angular.element(root).injector();
    injector.get('$rootScope').$on('$routeChangeSuccess', function(event, next, current) {
      if (next.$$route && next.$$route.redirectTo) {
        routeTo(next.$$route.redirectTo, injector);
      }
    });
    routeTo(path, injector);
  }

  function wait() {
    return new promise(function(resolve) {
      angular.getTestability(root).whenStable(resolve);
    });
  }



  return function(test) {
    var async = [];
    var methods = {
      andThen: function(step) {
        var boundStep = step.bind(app, root);
        async.push(function() {
          return wait().then(function() {
            return boundStep;
          });
        });
      },
      visit: function(path) {
        return this.andThen(function() {
          visit(root, path);
        });
      },
      click: function(selector, index) {
        return this.andThen(function() {
          var $el = $(selector, root)[!!index ? index : 0];
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

    test.apply(methods);
    if (async.length > 0) {
      app.start();
      var first = async.shift().apply(null);
      return async.reduce(function(memo, op) {
        return memo.then(op);
      }, first);
    } else {
      console.log('WARNING:', 'Test has no steps');
      return promise.resolve();
    }

  };

};
