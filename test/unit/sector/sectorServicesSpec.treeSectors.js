describe('sectorServices', function() {
  // Load sectorServices module
  beforeEach(module('sectorServices'));
  describe('treeSectors', function() {
    var treeSectors;
    var $httpBackend;
    var $timeout;
    var $rootScope;

    // TODO : mock elementarySectors
    // TODO : mock httpBackend request/response

    describe('getAll', function() {
      beforeEach(inject(function(_treeSectors_, _$timeout_, _$httpBackend_, _$rootScope_) {
        treeSectors = _treeSectors_;
        // We need this stuff to resolve promises
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
      }));

      it('should return an array containing all sectors', function(done) {
        treeSectors.getAll()
        //  .then(function(res) { dump(res); return res; })
          .should.eventually.contain({name: 'UXR', children: ['UR', 'XR']})
          .notify(done);
        // Promises won't resolve without this
        // Here, we have 2 timeouts
        $timeout.flush();
        $timeout.flush();
      });

      it('should return an array containing expanded sectors', function(done) {
        treeSectors.getAll()
          .should.eventually.contain(
            {name: '4E', children: ['UE', 'XE', 'KE', 'HE']}
          )
          .notify(done);

          $timeout.flush();
          $timeout.flush();
      });

      it('should return the former loading promise when called again', function(done) {
        var first = treeSectors.getAll();
        var second = treeSectors.getAll();
        expect(first).to.eql(second);
        done();
      });

      it('should return an in memory object when loaded', function(done) {
        var r1;
        var r2;
        treeSectors.getAll()
        // Get from backend
        .then(function(r1) {
          setTimeout(function() {
            treeSectors.getAll()
            // Get again from memory
            .then(function(r2) {
              expect(r1).to.eql(r2);
              done();
            });
            $rootScope.$digest();
          }, 600);
        });
        $timeout.flush();
        $timeout.flush();
      });
    });

    describe('getFromString', function() {
      beforeEach(inject(function(_treeSectors_, _$timeout_, _$httpBackend_, _$rootScope_) {
        treeSectors = _treeSectors_;
        // We need this stuff to resolve promises
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
      }));

      it('should return proper children from string', function(done) {
        treeSectors.getFromString('4E')
        .should.eventually.eql(['UE', 'XE', 'KE', 'HE'])
        .notify(done);

        $timeout.flush();
        $timeout.flush();
      });

      it('should return a single sector in case of elementary sector', function(done) {
        treeSectors.getFromString('UE')
        .should.eventually.eql(['UE'])
        .notify(done);
        $timeout.flush();
        $timeout.flush();
      });

      it('should return an empty array given an unknown sector group', function(done) {
        treeSectors.getFromString('foo')
        .should.eventually.eql([])
        .notify(done);

        $timeout.flush();
        $timeout.flush();
      });
    });
  });
});