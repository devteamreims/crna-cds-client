'use strict';

/**
 * @ngdoc function
 * @name crnaClientApp.arcid
 * @description
 * # arcid module
 * Meta module to include arcid components
 */
angular
  .module('4meCdsApp')
  .directive('fourmeReloadApp', function() {
    return {
      restrict: 'E',
      controller: ['$window', function($window) {
        var vm = this;
        vm.reloadApp = function() {
          $window.location.reload();
        };
      }],
      controllerAs: 'reloadApp',
      transclude: true,
      template: '<span ng-click="reloadApp.reloadApp()" ng-transclude></span>'
    };
  });
