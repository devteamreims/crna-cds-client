'use strict';

/**
 * @ngdoc function
 * @name crnaRouting
 * @description
 * angular-ui-router configuration
 * https://github.com/angular-ui/ui-router
 */

angular.module('4meCdsRoutes', ['ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/'); // Unmatched URLs, redirect to /

  $stateProvider
    .state('root', {
      url: '/',
      templateUrl: 'views/dashboard.html'
    });
}]);

