'use strict';

/**
 * @ngdoc function
 * @name arcidServices
 * @description
 * # ctrlroomServices
 * Services for the control room management
 **/
angular.module('ctrlroomServices', [])
.factory('ctrlroomPosition', ctrlroomPosition);

ctrlroomPosition.$inject = ['$q', '$timeout'];

function ctrlroomPosition($q, $timeout) {

  var get = function(positionId) {
    var defer = $q.defer();

    var r = {
      id: positionId,
      sectors: ['UR', 'XR'],
      sectorString: 'UXR'
    };

    // Simulate async stuff
    $timeout(function() {
      defer.resolve(r);
    }, 4000 + Math.floor((Math.random() * 4) + 1)*1000);

    return defer.promise;

  };

  var set = function(positionId, sectors) {


    return r;
  };

  var service = {
    get: get
  };

  return service;

}

