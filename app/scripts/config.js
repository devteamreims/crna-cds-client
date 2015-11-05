'use strict';
/**
 * @ngdoc overview
 * @name crnaClientApp
 * @description
 * # crnaClientApp.config
 *
 * Main configuration of the application.
 */
angular.module('4meCdsApp')
.config(applyTheme);


applyTheme.$inject = ['$mdThemingProvider'];
function applyTheme($mdThemingProvider) {
  // We should define a dark theme here, but this is not working consistently with ngMaterial
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('green', {
      'default': '600'
    })
    .warnPalette('deep-orange', {
      'default': '500'
    })
    ;
  $mdThemingProvider.theme('success-warning')
    .primaryPalette('green')
    .accentPalette('orange', {
      'default': '800'
    })
    ;
}
