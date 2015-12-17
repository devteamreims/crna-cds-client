describe('sectorServices', function() {
  // Load sectorServices module
  beforeEach(module('sectorServices'));
  beforeEach(module('4meCdsConstants'));

  describe('treeSectors', function() {
    var treeSectors;
    var $httpBackend;
    var $timeout;
    var $rootScope;

    var mockElementarySectors = {};
    var mockCrnaSectors = [
      {name: 'UXR', children: ['UR', 'XR']},
      {name: 'KHR', children: ['KR', 'YR', 'HR']},
      {name: '5R', children: ['KHR', 'UXR']}
    ];


    // DONE : mock elementarySectors
    // DONE : mock httpBackend request/response

    beforeEach(function() {
      mockElementarySectors.getAll = sinon.stub().resolves(['UR', 'XR', 'KR', 'YR', 'HR']);

      module(function($provide) {
        $provide.value('elementarySectors', mockElementarySectors);
        $provide.constant('crnaSectors', mockCrnaSectors)
      });

      inject(function(_$timeout_, _$q_, _$httpBackend_, _$rootScope_, _treeSectors_, _cdsBackendUrl_) {
        sinonAsPromised(_$q_);

        treeSectors = _treeSectors_;
        // We need this stuff to resolve promises
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        // Fake backend here
        elemSectorsHandler = $httpBackend.when('GET', _cdsBackendUrl_ + '/sectors/tree')
          .respond([
            {name: 'UXR', elementarySectors: ['UR', 'XR']},
            {name: 'UR', elementarySectors: ['UR']},
            {name: '5R', elementarySectors: ['UR', 'XR', 'KR', 'YR', 'HR']}
          ]);
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAll', function() {
      it('should return an array containing all sectors', function(done) {
        treeSectors.getAll()
          .should.eventually.contain({name: 'UXR', elementarySectors: ['UR', 'XR']})
          .notify(done);
        // Promises won't resolve without this
        $httpBackend.flush();
      });

      it('should return the former loading promise when called again', function(done) {
        var first = treeSectors.getAll();
        var second = treeSectors.getAll();
        expect(first).to.eql(second);
        done();
        $httpBackend.flush();
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
          }, 200);
        });
        $httpBackend.flush();
      });
    });

    describe('getFromString', function() {
      it('should return proper children from string', function(done) {
        treeSectors.getFromString('UXR')
        .should.eventually.eql(['UR', 'XR'])
        .notify(done);

        $httpBackend.flush();
      });

      it('should return a single sector in case of elementary sector', function(done) {
        treeSectors.getFromString('UR')
        .should.eventually.eql(['UR'])
        .notify(done);

        $httpBackend.flush();
      });

      it('should return an empty array given an unknown sector group', function(done) {
        treeSectors.getFromString('foo')
        .should.eventually.eql(['foo'])
        .notify(done);

        $httpBackend.flush();
      });
    });
  });
});