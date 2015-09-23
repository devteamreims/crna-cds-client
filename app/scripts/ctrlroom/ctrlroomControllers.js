'use strict';

/**
 * @ngdoc function
 * @name arcid
 * @description
 * Control Room Controllers
 */
angular.module('ctrlroomControllers', ['underscore'])
.controller('CtrlRoomController', CtrlRoomController);

CtrlRoomController.$inject = ['$scope'];
function CtrlRoomController($scope) {
  var vm = this;
  vm.pouet = "CACABOUDIN";
}
