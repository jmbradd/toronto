/**
 * Created by jmbradd on 12/11/2015.
 */
app.controller("testController", ['$scope', '$rootScope', '$http', 'quizService', 'userService', 'socketService', '$cookies', '$location', function($scope, $rootScope, $http, quizService, userService, socketService, $cookies, $location) {

    $scope.qs = quizService
    $scope.currentUser = "";
    $scope.questions = [];

    $scope.logrooms = function(){
        console.log($scope.rooms)
    }


    $scope.joinServer = function(data){
        socketService.emit("bindsession", data)
    }

    $scope.joinRoom = function(roomId)
    {
        console.log("joining room " + roomId);
        quizService.joinRoom(roomId)

    }

    $scope.$on("$viewContentLoaded", function(){
        console.log("Test Controller Loaded");
        $scope.refreshUser();
    });

    $scope.refreshUser = function(){
        $scope.currentRooms = userService.getRooms();
        $scope.currentUser = userService.getUser();
    };

    $scope.sendMessage = function(form, roomID){
        console.log(form)
        console.log(roomID)
        socketService.emit("message:room", {'room' : roomID , 'user': $scope.currentUser, 'text' : form.message})
    }


    socketService.on("search", function(msg){
        console.log("we got something!")
        console.log(msg);
    })

    socketService.on("server:joined", function(){
        quizService.joinServer().then(function(res){
            console.log("Connected to server!")
            socketService.emit("bindsession")
        })
    })

    socketService.on("redirect", function(data){
        $location.path(data.redirect);
    })

    socketService.on("", function(anything){
        console.log(anything);
    })

    socketService.on("greeting", function(data){
        alert(data.text);
    })

    $scope.refreshUser();





}]);