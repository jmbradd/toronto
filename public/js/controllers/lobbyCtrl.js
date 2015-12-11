/**
 * Created by jmbradd on 11/24/2015.
 */

app.controller("lobbyCtrl", ['$scope', '$rootScope', '$http', 'quizService', 'socketService', function($scope, $rootScope, $http, quizService, socketService) {

    //$scope.qs = quizService


    $scope.$on("$viewContentLoaded", function(){
        console.log("view loaded");

        quizService.getRooms()

    })
}]);