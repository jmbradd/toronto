/**
 * Created by jmbradd on 11/28/2015.
 */
app.controller("userCtrl", ['$scope', '$rootScope', '$http', 'quizService', 'userService', 'socketService', '$cookies', function($scope, $rootScope, $http, quizService, userService, socketService, $cookies) {

    $scope.currentRooms = [];
    $scope.currentUser = "";


    $scope.joinServer = function(data){
        quizService.joinServer(data).then(function(res){
            console.log("Connected to server!")
            socketService.emit("player:bind", $cookies.get("connect.sid"))
        });
    };



    $scope.$on("$viewContentLoaded", function(){
        console.log("User Controller Loaded");
        $scope.refreshUser();
    });

    $scope.refreshUser = function(){
        $scope.currentRooms = userService.getRooms();
        $scope.currentUser = userService.getUser();
    };

    $rootScope.$on("refreshuser", function(){
        console.log("refreshing user data");
        $scope.refreshUser();
    });

    socketService.on("greeting", function(greeting){
        console.log(greeting);
    })

    socketService.on("connection", function(sock){
        sock.emit("bind:session")
    });

    socketService.on("search", function(msg){
        console.log("we got something!")
        console.log(msg);
    })

    socketService.on("", function(anything){
        console.log(anything);
    })

    $scope.refreshUser();





}]);