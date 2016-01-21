/**
 * Created by jmbradd on 11/28/2015.
 */
app.controller("userCtrl", ['$scope', '$rootScope', '$http', 'quizService', 'userService', 'socketService', '$cookies','$location', function($scope, $rootScope, $http, quizService, userService, socketService, $cookies, $location) {

    $scope.us = userService

    $scope.joinServer = function(data)
    {
        console.log(data)
        socketService.emit("bindsession", data)
        $scope.us.loggedIn = true
    }

    $scope.logout = function()
    {
        socketService.emit("logout");
        $scope.us = {}
    }

    socketService.on("redirect", function(data)
    {
        console.log("redirect message caught");
        $location.path(data.redirect);
    })


}]);