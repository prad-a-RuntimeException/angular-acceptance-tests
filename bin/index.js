var $ = require('jquery');
var testHelpers = require('../lib/test-helpers');
module.exports = function() {


    var app;
    var root;

    function init(AngularApp, components) {
        this.root = $('<div></div>');
        this.angularApp = new AngularApp(
            this.root, {}, function($provide) {
                setupStubs($provide, components);
            });
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



    return {
        init: init,
        run: testHelpers.run,
        destroy: destroy
    };

};
