'use strict';
/*
 * Include underscore.js library into angular
 */
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._;
});
