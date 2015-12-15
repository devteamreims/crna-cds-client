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
        url: cdsBackendUrl + '/sectors/elementary'
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


  function _getFromBackend() {
    if(loadingPromise === undefined) {
      // We have nothing already loading
      // create a promise
      // TODO : replace by a real backend
      loadingPromise = $http({
        method: 'GET',
        url: cdsBackendUrl + '/sectors/tree'
      })
      // Expand them
      // TODO : Put this back in the backend
      .then(function(res) {
        //sectors = _expandAll(s);
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
        // Not found ! Should never happen ?
        return [];
      } else {
        // Return array of children
        if(_.isEmpty(sectorsGroup.children)) {
          return [sectorsGroup.name]; // Elementary sector detected, return a single sector
        } else {
          return sectorsGroup.children; // Return group of elementary sectors
        }
      }
    });
    return promise;
  }

  /*
   * _expandAll() (async)
   * returns a promise of expanded sectors tree
   * sets internal sectors var to expanded sectors tree
   *
   */
  function _expandAll(input) {
    // Multiple loops here !
    // TODO : This logic belongs in the backend
    var self = this;
    var expanded = [];
    // Get all elementary sectors
    return elementarySectors.getAll()
    .then(function(elemSect) {
      // Loop through initial list
      _.each(input, function(nonExSector) {
        var children = [];
        // Loop through children
        _.each(nonExSector.children, function(c) {
          children.push(_expandSingle(c, input, elemSect));
        });
        expanded.push({
          name: nonExSector.name,
          children: _.flatten(children)
        });
      });
      // Add elementary sectors
      _.each(elemSect, function(e) {
        expanded.push({
          name: e,
          children: [e]
        });
      });
      return expanded;
    });
  }

  /*
   * _expandSingle() (sync)
   * name : string containing the name of the sector grouping
   * tree : full tree
   * elem : array of elementary sectors
   * returns an array with expanded children
   * this should be recursive :
   * KD2F -> [KD, 2F] -> [KD, KF, UF]
   */
  function _expandSingle(name, tree, elem) {
    if(_.contains(elem, name)) {
      // name is already an elementary sector
      return [name];
    }
    var ret = [];
    var treeMap = _.findWhere(tree, {name: name});
    _.each(treeMap.children, function(c) {
      // Loop through children
      if(_.contains(elem, c)) {
        // This child is an elementary sector, add it to ret
        ret.push(c);
        return; // Go to the next item
      } else {
        // This child is not an elementary sector, expand it
        ret.push(_expandSingle(c, tree, elem));
        // Flatten the array
        ret = _.flatten(ret);
        return;
      }
    });
    return ret;
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

