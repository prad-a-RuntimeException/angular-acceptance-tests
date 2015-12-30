'use strict';
var createHarness = require('../../index.js');

describe('acceptance test', function() {
    it('should ....', function() {
        var harness = createHarness('myApp');

        return harness.run(function(){
            return this.andThen(function(){
                expect(true).toEqual(false);
                harness.stop();
            });
        });
    });
});