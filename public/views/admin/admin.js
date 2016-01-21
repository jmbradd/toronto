/**
 * Created by jmbradd on 1/21/2016.
 */
angular.module('toronto.admin', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/admin', {
            templateUrl: './views/admin/admin.html',
            controller: 'adminController'
        });
    }]);