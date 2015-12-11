/**
 * Created by jmbradd on 11/24/2015.
 */
angular.module('toronto.lobby', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/lobby', {
            templateUrl: './views/lobby/lobby.html',
            controller: 'lobbyCtrl'
        });
    }]);