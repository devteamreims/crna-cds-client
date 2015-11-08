'use strict';
/**
 * @ngdoc overview
 * @name crnaClientApp
 * @description
 * # crnaClientApp
 *
 * Main module of the application.
 */
angular
.module('4meCdsApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'btford.socket-io',
    'ngMaterial',
    'ctrlroom', // Control room management module
    '4meCdsRoutes', // Angular-ui-router routes
    '4meCdsConstants' // Constants
//    'position', // Position module
//    'commonControllers' // Controllers communs
]);
