describe('utils', function() {

  // Load sectorServices module
  beforeEach(module('errorHandlerServices'));

  describe('errorHandler', function() {
    var errorHandler;
    beforeEach(inject(function(_errorHandler_) {
      errorHandler = _errorHandler_;
    }));

    it('should store errors', function() {
      return errorHandler.addError('bla').should.contain({type: 'error', string: 'bla'});
    });

    it('should error the whole application', function() {
      errorHandler.addError('bla');
      return errorHandler.isErrored().should.eql(true);
    });

    it('should provide a default error description', function() {
      var err = errorHandler.addError();
      return err.string.should.not.be.empty;
    });

    it('should add a timestamp', function() {
      var err = errorHandler.addError();
      return err.timestamp.should.be.an.instanceof(Date);
    });

    it('should retrieve errors', function() {
      var err = errorHandler.addError('bla');
      var err2 = errorHandler.addError('bla2');

      return [
        errorHandler.getErrors().should.contain(err),
        errorHandler.getErrors().should.contain(err2)
      ];
    });

  });
});