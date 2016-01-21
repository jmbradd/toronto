/**
 * Created by jmbradd on 11/24/2015.
 */

app.controller("lobbyCtrl", ['$scope', '$rootScope', '$http', 'quizService', 'socketService', 'userService', function($scope, $rootScope, $http, quizService, socketService, userService) {


    $scope.qs = quizService
    $scope.us = userService
    $scope.currentRoom = "";
    $scope.btnreadyClass = "btn-danger"
    $scope.button = "Not Ready"
    $scope.form = {}



    $scope.readyToggle = function(room){
        if ($scope.button != "Ready"){
            $scope.btnreadyClass = "btn-success"
            $scope.button = "Ready"
            socketService.emit("player:ready", {'player' : $scope.us.user, 'room' : room})
        }
        else
        {
            $scope.btnreadyClass = "btn-danger"
            $scope.button = "Not Ready"
            socketService.emit("player:unready", {'player' : $scope.us.user, 'room' : room})
        }
    }


    $scope.startQuiz = function(roomID){
        socketService.emit("quiz:start", roomID)
    }

    $scope.joinRoom = function(roomId)
    {
        console.log("joining room " + roomId);
        quizService.joinRoom(roomId)
    }
    $scope.sendMessage = function(form, room){
        var message = {'room' : room.id ,
                        'user': $scope.us.user.username,
                        'text' : form.message}

        socketService.emit("message:room", {'room' : room.id , 'user': $scope.us.user.username, 'text' : form.message})
        $scope.form.chat.message = ""
    }

    $scope.setRoom = function(roomID){

    }

    $scope.$on("$viewContentLoaded", function()
    {
        console.log("view loaded");
        quizService.getRooms()

    })

    $scope.roomJoined = function(status)
    {
        return function(item) {
            console.log(item)
            return item.status == status;
        }

    }

    $scope.gameInit = function(room){
        console.log("starting game!!")
        socketService.emit("game:create", room)
    }


}]);