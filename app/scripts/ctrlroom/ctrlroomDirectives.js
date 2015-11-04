'use strict';

/**
 * @ngdoc function
 * @name arcidDirectives 
 * @description
 * # ctrlroomDirectives
 * Directives for the control room management
 **/
angular.module('ctrlroomDirectives', ['ctrlroomServices'])
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

ctrlroomButtonController.$inject = ['$scope', '$q', 'ctrlroomPosition'];
function ctrlroomButtonController($scope, $q, ctrlroomPosition) {
  var vm = this;
  vm.positionClass = 'md-primary md-hue-1';
  vm.loading=true;
  $q.when(ctrlroomPosition.get($scope.position)).then(function(position) {
    vm.loading = false;
    vm.position = position;
    vm.positionClass = 'md-accent';
  });
}