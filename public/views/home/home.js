/**
 * Created by jmbradd on 12/12/2015.
 */
angular.module('toronto.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: './views/home/home.html',
            controller: 'homeController'
        });
    }]);