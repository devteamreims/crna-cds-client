'use strict';

/**
 * @ngdoc function
 * @name arcidServices
 * @description
 * # ctrlroomServices
 * Services for the control room management
 **/
angular.module('ctrlroomServices', ['4meCdsConstants', 'underscore'])
.factory('ctrlroomPosition', ctrlroomPosition);

ctrlroomPosition.$inject = ['_', '$q', '$timeout', 'crnaPositions'];

function ctrlroomPosition(_, $q, $timeout, crnaPositions) {

  /*
   * Format :
   * {
   *   {
   *     id: positionId,
   *     sectors: ['UR', 'XR'],
   *     sectorString: 'UXR',
   *     disabled: false
   *   }
   *
   * }
  */
  var positions = [];


  /*
   * Populate array with empty values
  */
  _.each(crnaPositions, function(positionId) {
    positions.push({
      id: parseInt(positionId),
      sectors: [],
      sectorString: '',
      disabled: false
    });
  });


  /*
   * get()
   * get a single position status
  */
  function get(positionId) {
    // Locate current position in our collection
    var s = _.findWhere(positions, {id: positionId});
    if(s === undefined) { // Positions 15 and 16 ?
      s = {
        id: positionId,
        sectors: [],
        sectorString: '',
        disabled: true // Set as disabled positions
      };
    }

    return s;
  };

  /*
   * refreshAll()
   * refresh all position statuses from server
  */
  function refreshAll() {
    // Simulate async stuff
    var promises = [];
    _.each(crnaPositions, function(positionId) { /* Mock 3 open positions */
      positionId = parseInt(positionId);
      if(positionId === 31) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.sectors = ['UR', 'XR'];
            s.sectorString = 'UXR';
          }, 3000)
        );
      } else if(positionId === 32) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.sectors = ['KR', 'HR'];
            s.sectorString = 'KHR';
          }, 5000)
        );
      } else if(positionId === 36) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.sectors = ['UN', 'UB', 'KN', 'HN'];
            s.sectorString = '4N';
          }, 7000)
        );
      }
    });

    return $q.all(promises);
  };

  function set(positionId, sectors) {
    var defer = $q.defer();

    return defer.promise;
  };

  var service = {
    get: get,
    refreshAll: refreshAll,
    set: set
  };

  return service;

}

