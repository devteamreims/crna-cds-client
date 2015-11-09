'use strict';

/**
 * @ngdoc function
 * @name arcidServices
 * @description
 * # ctrlroomServices
 * Services for the control room management
 **/
angular.module('ctrlroomServices', ['4meCdsConstants', 'underscore', 'sectorServices'])
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
  var properties = {
    hasChanges: false,
    loading: true
  };

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
  }

  /*
   * refreshAll()
   * refresh all position statuses from server
  */
  function refreshAll() {
    var self = this;
    // Simulate async stuff
    var promises = [];
    self.properties.loading = true;
    _.each(crnaPositions, function(positionId) { /* Mock 3 open positions */
      positionId = parseInt(positionId);
      if(positionId === 31) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['UR', 'XR']);
            s.changed = false;
          }, 1000)
        );
      } else if(positionId === 32) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['KR', 'YR', 'HR']);
            s.changed = false;
          }, 2000)
        );
      } else if(positionId === 36) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['UN', 'UB', 'KN', 'HN']);
            s.changed = false;
          }, 2500)
        );
      } else if(positionId === 21) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['UH', 'XH', 'KH', 'HH']);
            s.changed = false;
          }, 1500)
        );
      } else if(positionId === 25) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['UE', 'XE', 'KE', 'HE']);
            s.changed = false;
          }, 1000)
        );
      } else if(positionId === 23) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['E', 'SE']);
            s.changed = false;
          }, 1200)
        );
      } else if(positionId === 20) {
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors(['KD', 'KF', 'UF']);
            s.changed = false;
          }, 1000)
        );
      } else {
        // Empty position
        promises.push(
          $timeout(function() {
            var s = _.findWhere(positions, {id: positionId});
            s.setSectors([]);
            s.changed = false;
          }, 100)
        );
      }
    });

    return $q.all(promises).then(function() {
      self.properties.loading = false;
      self.properties.hasChanges = false;
    });
  }

  function addSectors(newPosition, sectors) {
    var self = this;
    if(sectors === undefined || sectors.length === 0) { // Input sanitation
      return false;
    } 

    // Handle single sector
    if(!_.isArray(sectors)) {
      sectors = [sectors];
    }

    /* We need to find all positions with said sectors and remove them */
    _.each(sectors, function(s) { // Loop through given sectors
      var oldPosition = _.find(positions, function(p) { // Loop through positions and find the one bound to sector
        return _.contains(p.sectors, s);
      });
      oldPosition.changed = true; // Activate changed flag
      oldPosition.setSectors(_.without(oldPosition.sectors, s)); // Remove from given position
    });

    newPosition.changed = true; // Activate changed flag
    newPosition.setSectors(_.union(newPosition.sectors, sectors)); // Bind to new position

    self.properties.hasChanges = true;
    return true;

  }

  function commitChanges() {
    // Commit changes to backend
    self.properties.loading = true;
    return $timeout(function() {
      self.properties.loading = false;
    }, 3000);
  }

  var service = {
    getSingle: getSingle,
    refreshAll: refreshAll,
    addSectors: addSectors,
    properties: properties,
    commitChanges: commitChanges
  };

  return service;

}

/* Single position factory */
ctrlroomPosition.$inject = ['_', '$q', '$timeout', 'crnaPositions', 'elementarySectors', 'treeSectors'];
function ctrlroomPosition(_, $q, $timeout, crnaPositions, elementarySectors, treeSectors) {

  var ctrlroomPosition = function(positionId) {
    this.id = positionId;
    this.sectors = [];
    this.disabled = true;
    this.sectorString = '-';
    this.changed = false;
  };


  ctrlroomPosition.prototype.setSectors = function(sectors) {
    var self = this;
    self.sectors = sectors;
    // Async compute string
    self.computeSectorString().then(function(str) {
      self.sectorString = str;
    });

    return self;
  };

  /*
   * computeSectorString (async)
   * returns a promise computing sector string
   */
  ctrlroomPosition.prototype.computeSectorString = function(sectors) {
    var self = this;
    var s = sectors;
    if(s === undefined || s.length === 0) {
      s = self.sectors;
    }

    return treeSectors.getAll().then(function(allSectors) {
      var sectorString = '-';
      if(s.length !== 0) {
        var sct = _.find(allSectors, function(e) {
          return _.isEqual(s.sort(), e.children.sort());
        });
        sectorString = sct.name;
      }
      return sectorString;
    });

  };

  ctrlroomPosition.prototype.getSuggestedSectors = function() {
    var self = this;
    // TODO : put this in a service
    return _.difference(elementarySectors.getAll(), self.sectors);
  };

  return {
    getInstance: function(positionId) {
      return new ctrlroomPosition(positionId);
    }
  };

}

