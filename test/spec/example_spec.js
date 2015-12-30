'use strict';
var createHarness = require('../../index.js');
var rootHtml = '<head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>My AngularJS App</title> <meta name="description" content=""> <meta name="viewport" content="width=device-width, initial-scale=1"> </head> <body> <ul class="menu"> <li><a href="#/view1">view1</a></li> <li><a href="#/view2">view2</a></li> </ul> <div ng-view></div> <div>Angular seed app: v<span app-version></span></div> <script src="bower_components/angular/angular.js"></script> <script src="bower_components/angular-route/angular-route.js"></script>  <script src="view1/view1.js"></script> <script src="view2/view2.js"></script> <script src="components/version/version.js"></script> <script src="components/version/version-directive.js"></script> <script src="components/version/interpolate-filter.js"></script> </body> </html>';

function bootStrap(appName) {
  appName = appName || 'myApp';

  angular.module(appName, [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version'
  ]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/view1'
    });
  }]);
}

describe('acceptance test', function() {

  beforeEach(function() {
    this.harness = createHarness('myApp', bootStrap, rootHtml);
  });

  afterEach(function() {
    this.harness.stop();
  });
  it('should ....', function() {
    return this.harness.run(function() {
      this.verify(function() {
        expect($('.conditions-list li').length).to.equal(1);
      });
    });
  });
});
