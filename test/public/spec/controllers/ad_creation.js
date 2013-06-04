'use strict';

describe('Controller: AdCreationCtrl', function () {

  // load the controller's module
  beforeEach(module('sospomocFrontendApp'));

  var AdCreationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdCreationCtrl = $controller('AdCreationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
