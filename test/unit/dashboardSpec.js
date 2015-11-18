describe('Dashboard', function() {
  var $compile,
      $rootScope;

  // Load the app module
  beforeEach(module('4meCdsApp'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should show ctrlroom buttons', function() {
    // Compile the element
    var element = $compile('<ctrlroom-dashboard></ctrlroom-dashboard')($rootScope);
    // Digest the element
    $rootScope.$digest();

    expect(element.html()).to.contain('<ctrlroom-button');
  });
});