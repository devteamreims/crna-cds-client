'use strict';

/**
 * @ngdoc function
 * @name sectorServices
 * @description
 * # sectorServices
 * Services for the sectors management
 **/
angular.module('sectorServices', ['4meCdsConstants', 'underscore'])
.factory('elementarySectors', elementarySectors)
.factory('treeSectors', treeSectors)
.factory('suggestedSectors', suggestedSectors);

// Atomic / elementary sectors
elementarySectors.$inject = ['_', '$q', '$http', 'cdsBackendUrl'];
function elementarySectors(_, $q, $http, cdsBackendUrl) {

  var sectors = [];
  var loadingPromise;
  var service = {};
  var apiEndpoint = cdsBackendUrl + '/sectors/elementary';

  // Private functions
  function _getFromBackend() {
    if(loadingPromise !== undefined) {
      // We are already loading from backend
      return loadingPromise;
    } else {
      // TODO : replace by a real backend
      // 
      loadingPromise = $http({
        method: 'GET',
        url: apiEndpoint
      }).then(function(res) {
        sectors = res.data;
        return sectors;
      });
      return loadingPromise;
    }
  }


  // Public API

  /*
   * get all elementary sectors
   * returns a promise
   */
  service.getAll = function() {
    var self = this;
    if(_.isEmpty(sectors)) { 
      // Nothing loaded, refresh from backend
      return _getFromBackend();
    } else {
      // We have in memory stuff, returns a mock promise
      var def = $q.defer();
      def.resolve(sectors);
      return def.promise;
    }
  }

  return service;
}


treeSectors.$inject = ['_', '$q', '$http', 'elementarySectors', 'cdsBackendUrl'];
function treeSectors(_, $q, $http, elementarySectors, cdsBackendUrl) {
  var sectors = [];
  var loadingPromise;
  var service = {};
  var apiEndpoint = cdsBackendUrl + '/sectors/tree';


  function _getFromBackend() {
    if(loadingPromise === undefined) {
      // We have nothing already loading
      // create a promise
      loadingPromise = $http({
        method: 'GET',
        url: apiEndpoint
      })
      .then(function(res) {
        sectors = res.data;
        return sectors;
      });
    }
    return loadingPromise;
  }


  /*
   * get fully expanded sector tree
   * returns a promise
   */
  service.getAll = function() {
    if(_.isEmpty(sectors)) { // Nothing loaded, refresh from backend
      var p = _getFromBackend();
      return p;
    } else {
      // Sectors loaded, returns promise resolving to in memory stuff
      var def = $q.defer();
      def.resolve(sectors);
      return def.promise;
    }
  }

  /*
   * getFromString() (async)
   * returns a promise of expanded list of
   * elementary sectors given a grouping name
   *
  **/
  service.getFromString = function(str) {
    var self = this;
    var promise = self.getAll()
    .then(function(sectors) {
      // Find with string
      var sectorsGroup = _.findWhere(sectors, {name: str});
      if(sectorsGroup === undefined) {
        // Not found ! Should never happen !
        return [str];
      } else {
        return sectorsGroup.elementarySectors; // Return group of elementary sectors
      }
    });
    return promise;
  }

  return service;
}


suggestedSectors.$inject = ['_', '$q', '$timeout', 'ctrlroomManager', 'suggestedSectorsEmptyPosition', 'suggestedSectorAdditions'];
function suggestedSectors(_, $q, $timeout, ctrlroomManager, suggestedSectorsEmptyPosition, suggestedSectorAdditions) {
  var service = {
    fromPositionId: fromPositionId
  };

  /*
   * fromPositionId(positionId) (async)
   * returns a promise of an array of strings
   * suggesting groupings given a position number
   *
  **/

  function fromPositionId(positionId) {
    var self = this;
    var position = ctrlroomManager.getSingle(positionId);
    var ret = [];
    if(_.isEmpty(position.sectors)) { // We have an empty position
      ret = suggestedSectorsEmptyPosition[position.id];
    } else {
      ret = suggestedSectorAdditions[position.sectorString];
    }
    // Mock http get request
    return $timeout(function() {
      return ret;
    }, 500);
  }

  return service;

}

