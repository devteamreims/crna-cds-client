describe('sectorServices', function() {

  // Load sectorServices module
  beforeEach(module('sectorServices'));



  describe('elementarySectors', function() {
    var elementarySectors;
    var $httpBackend;
    var $timeout;
    beforeEach(inject(function(_elementarySectors_, _$timeout_, _$httpBackend_) {
      elementarySectors = _elementarySectors_;
      // We need $timeout here to resolve promises
      $timeout = _$timeout_
      $httpBackend = _$httpBackend_
    }));

    describe('getAll', function() {
      it('should return an array containing elementary sectors', function(done) {
        elementarySectors.getAll()
//          .then(function(res) { dump(res); return res; })
          .should.eventually.contain('UR')
          .notify(done);
        // Promises won't resolve without this
        $timeout.flush();
        // Here we flush our backend
        $httpBackend.flush();
      });
    });

  });

});