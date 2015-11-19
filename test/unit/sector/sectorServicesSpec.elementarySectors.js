describe('sectorServices', function() {

  // Load sectorServices module
  beforeEach(module('sectorServices'));



  describe('elementarySectors', function() {
    var elementarySectors;
    var $httpBackend;
    var $timeout;
    var $rootScope;
    beforeEach(inject(function(_elementarySectors_, _$timeout_, _$httpBackend_, _$rootScope_) {
      elementarySectors = _elementarySectors_;
      // We need this stuff to resolve promises
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    describe('getAll', function() {
      it('should return an array containing elementary sectors', function(done) {
        elementarySectors.getAll()
//          .then(function(res) { dump(res); return res; })
          .should.eventually.contain('UR')
          .notify(done);
        // Promises won't resolve without this
        $timeout.flush();
        // Here we flush our http requests;
        $httpBackend.flush();
      });

      it('should return the former loading promise when called again', function(done) {
        var first = elementarySectors.getAll();
        var second = elementarySectors.getAll();
        expect(first).to.eql(second);
        done();
      });

      it('should return an in memory object when loaded', function(done) {
        var r1;
        var r2;
        elementarySectors.getAll()
        // Get from backend
        .then(function(r1) {
          setTimeout(function() {
            elementarySectors.getAll()
            // Get again from memory
            .then(function(r2) {
              expect(r1).to.eql(r2);
              done();
            });
            $rootScope.$digest();
          }, 200);
        });
        $timeout.flush();
      });
    });

  });

});