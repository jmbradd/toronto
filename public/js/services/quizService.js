/**
 * Created by jmbradd on 11/22/2015.
 *
 * This service is intended to hold all of the quiz game interaction including joining/leaving games and storing game states
 *
 * This might evolve further to house even more functionality in the future
 *
 */
app.factory("quizService", function($http, $rootScope, $q, $location, $cookies, $filter, userService, socketService){

    var service = {}
    service.rooms = []
    service.team = ""
    service.question = {}
    service.questionStatus = ""
    service.currentRoom = ""
    service.quizTeam = ""
    service.result = {}
    service.questionAnswered = false
    service.gameOver = false
    service.currentGame = {}
    service.currentScores = []


    //Methods for retrieving data from the service

    service.getPlayers = function(room)
    {
        //this function is not yet implemented and may end up deleted
        return players;
    };

    service.returnRooms = function(){
        return service.rooms;
    }

    //Game utilities - I don't think many of these are needed anymore

    service.joinServer = function(){
        var data = { "username" : "Cougarr"};
        return $http.post("http://192.168.1.2:1967/join", data, {withCredentials: false}).success(function(data, status){

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
        //return $http.get("http://192.168.1.2:1967/join/"+ roomId, {withCredentials : true}).success(function(res){
        //    rooms.push(res.data.room)
        //    $rootScope.$broadcast("refreshuser");
        //});
    };

    //retrieve a room list of all available rooms

    service.getRooms = function(){
        console.log("getting rooms");
        $http.get("http://192.168.1.3:1967/rooms", {withCredentials : false}).success(function(data, status){
            service.rooms =  data.rooms;
        }).error(function(err){
            console.log(err);
        })
    };

    service.setRoom = function(roomID){

        service.currentRoom = $filter('filter')(service.rooms, {id : roomID}, true);
        console.log("changing to room " + roomID)

    }

    service.answerQuestion = function(answer, playerID)
    {
        service.questionStatus = "answered"
        service.answerpending = true
        console.log("sending response to room "+ service.currentGame.id)
        socketService.emit("quiz:answer", {"gameID" : service.currentGame.id, "team" : service.team, "questionID" : service.question.uid, "response" : answer, "playerID" : playerID })
    }

    service.answer = function(response){
        service.answerpending = true
        socketService.emit("quiz:answer", response)
    }

    //Socket Methods - The bulk of this application is going through websockets

    socketService.on("message", function(msg) {
        console.log("recieved message")
        console.log(msg.room);
        service.rooms[msg.room].messages.push(msg)
        console.log(service.rooms)
        })


    socketService.on("gamemessage", function(msg)
    {
        console.log("game message is ", msg)
        service.currentRoom.messages.push(msg)
    })

    socketService.on("playerjoined", function(data)
    {
        console.log("player joined")
        console.log(data)
        console.log(data.player.username + "has joined room " + data.room.id)
        service.rooms[data.room.id].players.push(data.player)
        service.rooms[data.room.id].status = "joined";
    })

    socketService.on("teamassignment", function(team){
        console.log("welcome to ", team)
        service.team = team
    })

    socketService.on("rejoin:allrooms", function(rooms)
    {
        service.rooms = rooms;
    })

    socketService.on("rejoin:room", function(room)
    {
        service.rooms.push(room);
    })

    socketService.on("quiz:question", function(data){
        console.log(data.scores)
        service.questionAnswered = false
        service.questionStatus = ""
        service.question = data.question;
        service.currentScores = data.scores
    })

    socketService.on("quiz:started", function(game){
        console.log("quiz quiz started")
        $location.path("/quiz")
        service.currentGame = game

    })

    socketService.on("quiz:result", function(result)
    {
        console.log("result is here!")
        console.log(result)
        service.result = result
        service.answerpending = (result == "pending") ? true : false
        if(service.answerpending == true){
            console.log("waiting for other responses")
        }
        else{$rootScope.$broadcast("quizresult");}

    })
    socketService.on("userdata", function(data){
        console.log("recieved user data")
        console.log(data.rooms);
        service.rooms = data.rooms
    })

    socketService.on("quiz:over",function(data){
        $rootScope.$broadcast("quiz:over", data)
    })

    socketService.on("error", function(data){
        console.log("error broadcast received")
        $rootScope.$broadcast("error", data);
    })





    return service;

});