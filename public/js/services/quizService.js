/**
 * Created by jmbradd on 11/22/2015.
 */
app.factory("quizService", function($http, $rootScope, $q, $location, $cookies, userService, socketService){


    var service = {};

    service.rooms = [];



    service.getPlayers = function(){
        return players;
    };

    service.getQuestion = function(){
        return question;
    };

    service.fetchQuestion = function(){
        $http.get("http://localhost:1967/event").then(function(response){
            question = response.data;
        });
    };

    service.joinServer = function(){
        var data = { "username" : "Cougarr"};
        return $http.post("http://localhost:1967/join", data, {withCredentials: true}).success(function(data, status){

            if(data.username){
                console.log("moving to " + data.redirect);
                userService.setUser(data.username);
                $location.path(data.redirect);
                $rootScope.$broadcast("refreshuser");
            }
            else {
                console.log("no idea why this would ever fail?  Consult your congressional representative ")
            }
        });
    };

    service.joinRoom = function(roomID){
        console.log("joining room " + roomID)
        socketService.emit("room:join", {'room' : roomID})
        //return $http.get("http://localhost:1967/join/"+ roomId, {withCredentials : true}).success(function(res){
        //    rooms.push(res.data.room)
        //    $rootScope.$broadcast("refreshuser");
        //});
    };

    service.getRooms = function(){
        console.log("getting rooms");
        $http.get("http://localhost:1967/rooms", {withCredentials : true}).success(function(data, status){
            service.rooms =  data.rooms;
        }).error(function(err){
            console.log(err);
        })
    };

    service.returnRooms = function(){
        return service.rooms;
    }

    socketService.on("message", function(msg){
        console.log("message is ", msg)
        service.rooms[msg.room].messages.push(msg)
    })

    socketService.on("playerjoined", function(data){
        console.log(data.player.username + "has joined room " + data.room)
        service.rooms[data.room].players.push(data.player);
    })

    return service;

});