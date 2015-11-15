'use strict';

/**
 * @ngdoc function
 * @name sectorDirectives 
 * @description
 * # sectorDirectives
 * Directives for the sectors
 **/

 angular.module('sectorDirectives', ['underscore', 'ctrlroomServices', 'sectorServices'])
// Sector suggestion directive
.directive('sectorSuggest', sectorSuggest)
.directive('urmeSectors', urmeSectors)
.directive('urmnSectors', urmnSectors);

// URMN sectors
function urmnSectors() {
  return {
    restrict: 'E',
    templateUrl: 'views/sector/_urmn.html'
  };
}

function urmeSectors() {
  return {
    restrict: 'E',
    templateUrl: 'views/sector/_urme.html'
  };
}

// Sector suggestions directive
function sectorSuggest() {
  return {
    restrict: 'E',
    templateUrl: 'views/sector/_suggest.html',
    controller: sectorSuggestController,
    controllerAs: 'suggestVm',
  }; 
}

sectorSuggestController.$inject = ['_', '$scope', '$timeout', 'suggestedSectors'];
function sectorSuggestController(_, $scope, $timeout, suggestedSectors) {
  var suggestVm = this;

  suggestVm.suggestedSectors = [];
  suggestVm.loading = true;

  var parentVm = $scope.vm;

  /*
   * Quick note about scopes
   * This directive doesn't have an isolated scope
   * We use $scope.vm to get back to our parent's scope ($mdDialog scope)
   * In our dialog, we use 'vm' as a view model, hence the correct path : $scope.vm.position.id
  **/
  suggestedSectors.fromPositionId(parentVm.position.id)
  .then(function(sectors) {
    suggestVm.loading = false;
    suggestVm.suggestedSectors = sectors;
  });

  /*
   * Click on suggestion button : add sectors then confirm
   */
  suggestVm.confirmSuggestion = function(s) {
    return 
      parentVm.addSectorsFromString(s)
      .then(function() {
        return parentVm.confirm();
      });
  };  

}