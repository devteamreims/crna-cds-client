'use strict';

/**
 * @ngdoc function
 * @name arcidDirectives 
 * @description
 * # ctrlroomDirectives
 * Directives for the control room management
 **/
angular.module('ctrlroomDirectives', ['underscore', 'ctrlroomServices'])
// ARCID Single flight detail panel
.directive('ctrlroomButton', ctrlroomButton);

/* ctrlroomButton */
function ctrlroomButton() {
  return {
    restrict: 'E',
    templateUrl: 'views/ctrlroom/_button.html',
    controller: ctrlroomButtonController,
    controllerAs: 'vm',
    scope: {
      position: '='
    }
  };
}

ctrlroomButtonController.$inject = ['_', '$scope', '$q', 'ctrlroomPosition', '$timeout'];
function ctrlroomButtonController(_, $scope, $q, ctrlroomPosition, $timeout) {
  var vm = this;
  vm.positionClass = 'md-primary';
  vm.positionDisabled = true;
  vm.loading = true;

  ctrlroomPosition.refreshAll(); // This needs to be set somewhere else

  vm.loading = false;
  vm.position = ctrlroomPosition.get($scope.position);

  vm.positionClass = function(position) {
    if(position.disabled === true) {
      return '';
    } else {
      if(_.isEmpty(position.sectors)) {
        return 'md-accent';
      } else {
        return 'md-primary';
      }
    }
  }

  vm.positionDisabled = vm.position.disabled;

}