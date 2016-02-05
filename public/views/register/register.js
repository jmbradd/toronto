/**
 * Created by jmbradd on 2/4/2016.
 */
angular.module('toronto.register', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: './views/register/register.html',
            controller: 'registerController'
        });
    }]);