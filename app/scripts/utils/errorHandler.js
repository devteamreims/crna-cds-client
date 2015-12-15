'use strict';

/**
 * @ngdoc function
 * @name errorHandlerServices
 * @description
 * # errorHandlerServices
 * Service for storing and handling errors
 **/

angular.module('errorHandlerServices', [])
.factory('errorHandler', errorHandler);

errorHandler.$inject = [];
function errorHandler() {
  var errors = [];
  /*
   * Array of objects :
    {
      type: 'error',
      string: 'Une erreur est survenue',
      timestamp: Date.now()
    }
  **/
  var blocked = false;
  var service = {};

  service.addError = function(str) {
    var errorString = str;
    if(errorString === undefined) {
      errorString = 'Une erreur est survenue';
    }
    var err = {
      type: 'error',
      string: errorString,
      timestamp: new Date()
    };
    errors.push(err);
    blocked = true;
    return err; 
  };

  service.isErrored = function() {
    return blocked;
  };

  service.getErrors = function() {
    return errors;
  };

  return service;
}