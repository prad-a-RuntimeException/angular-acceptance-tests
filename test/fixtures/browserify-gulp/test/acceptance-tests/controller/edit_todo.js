'use strict';
var chai = require('chai');
var expect = chai.expect;
var createHarness = require('../../../../../../index.js');
var appConfig = require('../../../app/js/app-config.js');
var $ = require('jquery');
var layoutHtml = require('../../../app/index.html');
describe('Home Page', function() {

  beforeEach(function() {
    this.harness = createHarness('todoApp', appConfig().bindServices, layoutHtml);
  });


  afterEach(function() {
    this.harness.stop();
  });

  describe('create workflow', function() {

    it('should create an new todo', function() {
      return this.harness.run(function() {
        this.visit('/todos');
        this.verify(function(root) {
          expect($('.current-item', root).text()).to.contain('Buy milk');
        });
      });
    });

  });

});
