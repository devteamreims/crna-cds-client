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
ctrlroomManager.$inject = ['_', '$q', '$timeout', 'crnaPositions','ctrlroomPosition', '$http', 'cdsBackendUrl'];
function ctrlroomManager(_, $q, $timeout, crnaPositions, ctrlroomPosition, $http, cdsBackendUrl) {
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
  var apiEndpoints = {
    getAll: cdsBackendUrl + '/positions',
    getSingle: cdsBackendUrl + '/positions/', // + positionId
    addSectors: '/addSectors' // getSingle + positionId + addSectors
  };
  var loadingPromise;

  /*
   * Populate array with empty objects
  */
  _getFromBackend();

  /*
   * getSingle(positionId)
   * get a single position status
  */
  function getSingle(positionId) {
    // Locate current position in our collection
    var s = _.findWhere(positions, {id: parseInt(positionId)});
    if(s === undefined) {
      s = ctrlroomPosition.getInstance(parseInt(positionId));
      positions.push(s);
    }
    return s;
  }

  function _getFromBackend() {
    properties.loading = true;
    // Create a placeholder array
    _.each(crnaPositions, function(p) {
      var positionInstance = ctrlroomPosition.getInstance(parseInt(p));
      positionInstance.disabled = true;
    });

    if(loadingPromise === undefined) {
      // We have nothing already loading
      // create a promise
      loadingPromise = $http({
        method: 'GET',
        url: apiEndpoints.getAll
      })
      .then(function(res) {
        console.log(res.data);
        _.each(res.data, function(p) {
          console.log(p);
          var positionInstance = getSingle(parseInt(p.id));
          positionInstance.disabled = p.disabled;
          positionInstance.setSectors(p.sectors);
          positionInstance.changed = false;
        })
        properties.loading = false;
        console.log('Data loaded from backend !');
        console.log(positions);
        return positions;
      });
    }
    return loadingPromise;
  }
  /*
   * refreshAll()
   * refresh all position statuses from server
  */
  function refreshAll() {
    return _getFromBackend();
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

    properties.hasChanges = true;
    return true;

  }

  function commitChanges() {
    var self = this;
    // Commit changes to backend
    properties.loading = true;
    var p = $timeout(function() {
      _.each(positions, function(p) {
        p.changed = false;
      });
      properties.hasChanges = false;
      properties.loading = false;
    }, 1500);
    return p;
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
          return _.isEqual(s.sort(), e.elementarySectors.sort());
        });
        if(sct === undefined) {
          // Grouping not found, fallback to elementary sectors with commas
          sectorString = s.toString();
        } else {
          sectorString = sct.name;
        }
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

