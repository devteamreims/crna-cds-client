'use strict';

/**
 * @ngdoc function
 * @name arcidDirectives 
 * @description
 * # ctrlroomDirectives
 * Directives for the control room management
 **/
angular.module('ctrlroomDirectives', ['underscore', 'ctrlroomServices', 'sectorServices'])
// Wrapper directive
.directive('ctrlroomDashboard', ctrlroomDashboard)
// Position button directive
.directive('ctrlroomButton', ctrlroomButton)
// Save / cancel changes button
.directive('ctrlroomConfirmPanel', ctrlroomConfirmPanel);

function ctrlroomDashboard() {
  return {
    restrict: 'E',
    templateUrl: 'views/ctrlroom/_dashboard.html',
    controller: ctrlroomDashboardController,
    controllerAs: 'vm'
  }; 
}

ctrlroomDashboardController.$inject = ['ctrlroomManager'];
function ctrlroomDashboardController(ctrlroomManager) {
  var vm = this;
  vm.hasChanges = function() {
    if(ctrlroomManager.properties.isLoading === true) {
      // No changes when loading
      return false;
    }
    if(ctrlroomManager.properties.hasChanges === true) {
      return true;
    } else {
      return false;
    }
  };

  vm.isLoading = function() {
    if(ctrlroomManager.properties.loading === true) {
      return true;
    } else {
      return false;
    }
  };

}


/* ctrlroomButton */
function ctrlroomButton() {
  return {
    restrict: 'E',
    templateUrl: 'views/ctrlroom/_button.html',
    controller: ctrlroomButtonController,
    controllerAs: 'vm',
    scope: {
      position: '='
    }
  };
}

ctrlroomButtonController.$inject = ['_','ctrlroomManager', '$scope', '$q', '$timeout', '$mdDialog'];
function ctrlroomButtonController(_, ctrlroomManager, $scope, $q, $timeout, $mdDialog) {
  var vm = this;
  vm.positionDisabled = true;
  vm.loading = true;

  ctrlroomManager.refreshAll().then(function() {
    vm.positionDisabled = vm.position.disabled;
    vm.loading = false;
  }); // This needs to be set somewhere else : see ui-router

  vm.position = ctrlroomManager.getSingle($scope.position);

  vm.positionClass = function(position) {
    if(ctrlroomManager.properties.loading === true) {
      // No class when loading
      return '';
    }
    if(position.disabled === true) {
      return '';
    } else {
      if(position.changed === true) {
        return 'md-warn';
      }
      if(_.isEmpty(position.sectors)) {
        return 'md-primary md-hue-3';
      } else {
        return 'md-accent';
      }
    }
  }

  vm.isLoading = function() {
    if(ctrlroomManager.properties.loading === true) {
      return true;
    } else {
      return false;
    }
  };

  vm.showDialog = function(ev) {
    /* Filter out disabled positions */
    if(vm.position.disabled === false) {
      $mdDialog.show({
        controller: ctrlroomDialogController,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'views/ctrlroom/_dialog.html',
        locals: {
          position: vm.position
        },
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    }
  }

  vm.positionDisabled = vm.position.disabled;

}

ctrlroomDialogController.$inject = ['_', '$scope', 'ctrlroomManager', 'position', '$mdDialog', 'treeSectors'];
function ctrlroomDialogController(_, $scope, ctrlroomManager, position, $mdDialog, treeSectors) {
  var vm = this;
  vm.position = position;
  vm.selectedSectors = [];
  vm.newSectorString = '';

  vm.cancel = function() {
    $mdDialog.cancel();
  };
  vm.confirm = function() {
    // We need to add selectedSectors to our position
    ctrlroomManager.addSectors(vm.position, vm.selectedSectors);
    $mdDialog.hide();
  };

  vm.isLoading = function() {
    if(ctrlroomManager.properties.loading === true) {
      return true;
    } else {
      return false;
    }
  };

  vm.isChecked = function(s) {
    if(_.contains(vm.position.sectors, s)) {
      /* Already bound to position */
      return true;
    }
    if(_.contains(vm.selectedSectors, s)) {
      /* In selectedSectors */
      return true;
    }
    return false;
  };

  vm.isDisabled = function(s) {
    // Disable YR which is special
    return s === 'YR' || _.contains(vm.position.sectors, s);
  };

  vm.setSectorsFromString = function(s) {
    // Get sectors from string
    return treeSectors.getFromString(s)
    // Filter and assign to selectedSectors
    .then(function(sectors) {
      var filtered = _.without(sectors, 'YR');
      vm.selectedSectors = filtered;
      return vm.selectedSectors;
    })
    // Recompute sector string
    .then(function(selectedSectors) {
      return vm.position.computeSectorString(_.union(selectedSectors, vm.position.sectors));
    })
    // Assign to vm.newSectorString
    .then(function(str) {
      vm.newSectorString = str;
    });
  };

  vm.toggleSectorsFromString = function(s) {
    // Lookup string in treeSectors
    return treeSectors.getFromString(s)
    .then(function(sectors) {
      _.each(_.without(sectors, 'YR'), function(s) {
        vm.toggleSector(s)
      });
    });
  };

  vm.toggleSector = function(s) {
    if(_.indexOf(vm.selectedSectors, s) !== -1) { // Already selected sector, remove it
      if(s === 'HR' || s === 'YR') {
        vm.selectedSectors = _.without(vm.selectedSectors, 'HR', 'YR');
      } else {
        vm.selectedSectors = _.without(vm.selectedSectors, s);
      }
    } else {
      if(s === 'HR' || s === 'YR') {
        vm.selectedSectors.push('HR');
        vm.selectedSectors.push('YR');
      } else {
        vm.selectedSectors.push(s);
      }
    }
    // Recompute newSectorString
    vm.position.computeSectorString(_.union(vm.selectedSectors, vm.position.sectors))
    .then(function(str) {
      vm.newSectorString = str;
    });
  };
}

function ctrlroomConfirmPanel(_, ctrlroomManager) {
  return {
    restrict: 'E',
    templateUrl: 'views/ctrlroom/_confirm.html',
    controller: ctrlroomConfirmPanelController,
    controllerAs: 'vm',
    scope: {}
  };
}

ctrlroomConfirmPanelController.$inject = ['_', 'ctrlroomManager'];
function ctrlroomConfirmPanelController(_, ctrlroomManager) {
  var vm = this;

  vm.isVisible = function() {
    if(ctrlroomManager.properties.hasChanges === true) {
      return true;
    } else {
      return false;
    }
  };

  vm.isLoading = function() {
    if(ctrlroomManager.properties.loading === true) {
      return true;
    } else {
      return false;
    }
  };

  vm.cancel = function() {
    return ctrlroomManager.refreshAll();
  };

  vm.confirm = function() {
    return ctrlroomManager.commitChanges();
  };
}