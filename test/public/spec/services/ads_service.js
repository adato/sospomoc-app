'use strict';

describe('Service: adsService', function () {

  // load the service's module
  beforeEach(module('sospomocFrontendApp'));

  // instantiate service
  var adsService;
  beforeEach(inject(function (_adsService_) {
    adsService = _adsService_;
  }));

  it('should do something', function () {
    expect(!!adsService).toBe(true);
  });

});
