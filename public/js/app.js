/**
 * Created by jmbradd on 11/6/2015.
 */
//base app configuration.  Run a quick get request to see if a session exists and if not,
var app = angular.module("toronto", [
    'ngRoute',
    'toronto.lobby',
    'ngCookies',
    'SocketService'
]).config(['$routeProvider', function($routeProvider){
    $routeProvider.otherwise({redirectTo: '/'})
}]).run(function($rootScope, $location, $http, userService){
    $http.get('http://localhost:1967/initialize')
        .success(function(user) {
            userService.setUser(user.username);
        });
});
