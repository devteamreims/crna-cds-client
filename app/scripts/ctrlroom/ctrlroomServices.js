'use strict';

/**
 * @ngdoc function
 * @name arcidServices
 * @description
 * # ctrlroomServices
 * Services for the control room management
 **/
angular.module('ctrlroomServices', ['4meCdsConstants', 'underscore'])
.factory('ctrlroomPosition', ctrlroomPosition)
.factory('ctrlroomManager', ctrlroomManager);


/* Whole control room management */
ctrlroomManager.$inject = ['_', '$q', '$timeout', 'crnaPositions','ctrlroomPosition'];
function ctrlroomManager(_, $q, $timeout, crnaPositions, ctrlroomPosition) {
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
   * Populate array with empty objects
  */
  _.each(crnaPositions, function(positionId) {
    var positionInstance = ctrlroomPosition.getInstance(parseInt(positionId));
    positionInstance.disabled = false; // Set disabled to false
    positions.push(positionInstance);
  });

  /*
   * getSingle(positionId)
   * get a single position status
  */
  function getSingle(positionId) {
    // Locate current position in our collection
    var s = _.findWhere(positions, {id: positionId});
    if(s === undefined) { // Positions 15 and 16 ?
      s = ctrlroomPosition.getInstance(positionId);
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
            s.setSectors(['UR', 'XR']);
          }, 3000)
        );
      } else if(positionId === 32) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['KR', 'YR', 'HR']);
          }, 5000)
        );
      } else if(positionId === 36) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['UN', 'UB', 'KN', 'HN']);
          }, 7000)
        );
      } else if(positionId === 21) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['UH', 'XH']);
          }, 4000)
        );
      }
    });

    return $q.all(promises);
  };

  var service = {
    getSingle: getSingle,
    refreshAll: refreshAll
  };

  return service;

}

/* Single position factory */
ctrlroomPosition.$inject = ['_', '$q', '$timeout', 'crnaPositions', 'crnaAtomicSectors', 'crnaSectors'];
function ctrlroomPosition(_, $q, $timeout, crnaPositions, crnaAtomicSectors, crnaSectors) {

  var ctrlroomPosition = function(positionId) {
    this.id = positionId;
    this.sectors = [];
    this.disabled = true;
    this.sectorString = '';
  };


  ctrlroomPosition.prototype.setSectors = function(sectors) {
    var self = this;
    self.sectors = sectors;

    // compute sectorString once and for all
    var sectorString = '-'
    if(self.sectors.length !== 0) {
      var sct = _.find(crnaSectors, function(e) {
        return _.isEqual(self.sectors.sort(), e.children.sort());
      });
      if(sct === undefined) {
        sectorString = self.sectors.toString();
      } else {
        sectorString = sct.name;
      }
    }

    self.sectorString = sectorString;

    return self;

  };

  ctrlroomPosition.prototype.getSuggestedSectors = function() {
    var self = this;
    return _.difference(crnaAtomicSectors, self.sectors);
  };

  return {
    getInstance: function(positionId) {
      return new ctrlroomPosition(positionId);
    }
  };

}

