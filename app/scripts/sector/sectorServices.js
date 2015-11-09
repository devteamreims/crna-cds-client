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
.factory('treeSectors', treeSectors);

// Atomic / elementary sectors
elementarySectors.$inject = ['_', '$q', '$timeout', 'crnaAtomicSectors'];
function elementarySectors(_, $q, $timeout, crnaAtomicSectors) {

  var sectors = [];
  var loadingPromise;


  /*
   * get all elementary sectors
   * returns a promise
   */
  function getAll() {
    var self = this;
    if(self.loadingPromise !== undefined) {
      // We have something loading
      return self.loadingPromise;
    } else if(_.isEmpty(self.sectors)) { 
      // Nothing loaded, refresh from backend
      self.loadingPromise = $timeout(function() {
          self.sectors = angular.copy(crnaAtomicSectors);
          return self.sectors;
        }, 1000);
      return self.loadingPromise;
        
    } else {
      // We have in memory stuff, returns a mock promise
      var def = $q.defer();
      def.resolve(self.sectors);
      return def.promise;
    }
  }

  var service = {
    getAll: getAll
  };

  return service;
}


treeSectors.$inject = ['_', '$q', '$timeout', 'crnaSectors', 'elementarySectors'];
function treeSectors(_, $q, $timeout, crnaSectors, elementarySectors) {
  var sectors = [];
  var loadingPromise;

  /*
   * get fully expanded sector tree
   * returns a promise
   */
  function getAll() {
    var self = this;
    if(self.loadingPromise !== undefined) {
      // We have something loading, return this promise
      return self.loadingPromise;
    } else if(_.isEmpty(self.sectors)) { // Nothing loaded, refresh from backend
      
      self.loadingPromise = 
        $timeout(function() {
          sectors = angular.copy(crnaSectors);
          return sectors;
        }, 1000).then(function(sectors) {
          self.sectors = _expandAll(sectors);
          return self.sectors;
        })

      return self.loadingPromise;

    } else {
      // Sectors loaded, returns promise resolving to in memory stuff
      var def = $q.defer();
      def.resolve(self.sectors);
      return def.promise;
    }
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
      _.each(input, function(nonExSector) {
        // Loop through initial list
        var children = [];
        console.log('expanding ' + nonExSector.name);
        _.each(nonExSector.children, function(c) {
          children.push(_expandSingle(c, input, elemSect));
        });
        expanded.push({
          name: nonExSector.name,
          children: _.flatten(children)
        });
        console.log('Expanded ' + nonExSector.name + ' to ' + _.flatten(children).toString());
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
    console.log('ret : ' + name);
    console.log(ret);
    return ret;
  }

  var service = {
    getAll: getAll
  };

  return service;
}