/**
 * Created by jmbradd on 12/11/2015.
 */
app.controller("testController", ['$scope', '$rootScope', '$http', 'quizService', 'userService', 'socketService', '$cookies', '$location', function($scope, $rootScope, $http, quizService, userService, socketService, $cookies, $location) {

    $scope.qs = quizService
    $scope.us = userService
    $scope.currentUser = $scope.us.user.username
    $scope.questions = [];



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

    $scope.startQuiz = function(roomID){
        socketService.emit("quiz:start", roomID);
        $location.path("/quiz")
    }

    $scope.logout = function(){
        socketService.emit("logout");
    }


    socketService.on("search", function(msg){
        console.log("we got something!")
        console.log(msg);
    })

    socketService.on("server:joined", function()
    {
        quizService.joinServer().then(function(res){
            console.log("Connected to server!")
            socketService.emit("bindsession")
        })
    })

    socketService.on("redirect", function(data)
    {
        console.log("redirect message caught");
        $location.path(data.redirect);
    })

    socketService.on("greeting", function(data){
        alert(data.text);
    })

    $scope.refreshUser();





}]);