/**
 * Created by jmbradd on 11/6/2015.
 */
//base app configuration.  Run a quick get request to see if a session exists and if not,
var app = angular.module("toronto", [
    'ngRoute',
    'toronto.lobby',
    'toronto.quiz',
    'toronto.home',
    'toronto.register',
    'ngCookies',
    'SocketService',
    'ui.bootstrap'
]).config(['$routeProvider', function($routeProvider){
    $routeProvider.otherwise({redirectTo: '/home'})
}]);
