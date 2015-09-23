'use strict';

/**
 * @ngdoc function
 * @name mainWebSocket
 * @description
 * # Main Web Socket to communicate with our backend
 */

angular.module('mainWebSocket', ['btford.socket-io'])
// Socket.io Factory
.factory('socket', ['socketFactory', function (socketFactory) {
  var myFactory = socketFactory({
  });
  return myFactory;
}]);
