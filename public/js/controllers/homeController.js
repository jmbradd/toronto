/**
 * Created by jmbradd on 12/19/2015.
 */
app.controller("homeController", ['$scope', 'quizService', 'socketService', 'userService', '$http', '$location', function($scope, quizService, socketService, userService, $http, $location) {

    $scope.us = userService

    $scope.register = function(){
        $location.path('/register')
    }


}]);