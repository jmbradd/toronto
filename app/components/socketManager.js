/**
 * Created by jmbradd on 12/11/2015.
 *
 * This is turning into the bulk of the application.  This handles most of the logic around my web sockets
 */

var roomManager = require("../components/roomManager")
var assholeHost = require("../components/assholeHost")
var gameManager = require("../components/gameManager")
var _ = require('lodash')

var pendingGames = []

module.exports = function(app, io, server, sessionStore, sharedsession, sessions){

    io.use(sharedsession(sessions));



    io.on("connection", function(socket){
        console.log("user connected");
        socket.rejoinRooms = function()
        {
            for (room in socket.handshake.session.rooms){
                console.log("rejoining rooms")
                console.log(room)
                socket.join(room)
            }
        }

        if (socket.handshake.session.username)
        {

            console.log("Returning User " + socket.handshake.session.username)
            socket.handshake.session.socketID = socket.id
            roomManager.updatePlayerSocketID(socket.handshake.sessionID, socket.id)
            socket.handshake.session.save()
            console.log(socket.handshake.session.rooms)
            var userObj = {
                "username" : socket.handshake.session.username,
                "socketID" : socket.id,
                "rooms" : socket.handshake.session.rooms,
                "redirect" : "/lobby"
            }
            io.to(socket.id).emit("userdata", userObj)
            socket.rejoinRooms();
            io.to(socket.id).emit("rejoin:allrooms", socket.handshake.session.rooms)
        }
        else
        {
            io.to(socket.id).emit("userdata", {
                "username" : "",
                "socketID" : "socket connection down",
                "rooms" : [],
                "redirect" : "/"
            })

        }

        socket.on("bindsession", function(data)
        {
            console.log(data)
            console.log("Binding socket " + socket.id + " and session " + socket.handshake.sessionID )
            socket.handshake.session.socketID = socket.id
            socket.handshake.session.username = data.username
            socket.handshake.session.rooms = []
            socket.handshake.session.save()

            var player = roomManager.createPlayer(socket.handshake.sessionID, socket.handshake.session.username, socket.id)
            var userObj = {
                "username" : socket.handshake.session.username,
                "socketID" : socket.id,
                "rooms" : socket.handshake.session.rooms,
                "redirect" : "/lobby",
                "playerID" : socket.handshake.sessionID
            }
            io.to(socket.id).emit("userdata", userObj)
            io.to(socket.id).emit("redirect", {"redirect" : "/lobby"})

        })

        socket.on("room:join", function(data)
        {

            console.log(socket.handshake.session.username + " is joining " + data.room )

            roomManager.getPlayer(socket.handshake.sessionID, data,
            function(playerObj){
                console.log(playerObj)
                roomManager.joinRoom(playerObj.data.room, playerObj.player.id, function(data){

                    socket.join(data.room.id)
                    data.room.status = "joined"
                    socket.handshake.session.rooms.push(data.room)
                    socket.handshake.session.save()
                    io.to(data.room.id).emit("playerjoined", data)
                    var greeting = assholeHost.getGreeting("newPlayer");

                    roomManager.addMessage({ 'room' : data.room.id, "text" : greeting.text, "user" : "The Host"})
                    io.to(data.room.id).emit("message", { 'room' : data.room.id, "text" : greeting.text, "user" : "The Host"});


                })

            });



        })

        socket.on("message:room", function(msg)
        {
            console.log("room message recieved");
            roomManager.addMessage(msg);
            console.log(msg.room)
            io.to(msg.room).emit("message", {'room' : msg.room, 'text' : msg.text, 'user' : msg.user})
        })

        socket.on("message:gameroom", function(msg)
        {
            console.log("game room message recieved");
            roomManager.addMessage(msg);
            io.to(msg.room).emit("gamemessage", {'room' : msg.room, 'text' : msg.text, 'user' : msg.user})
        })

        socket.on("game:create", function(data){
            //todo: write this shit

            console.log("starting game!")
            console.log(data)

            roomManager.getReadyRoom(data.id, function(gameObj)
            {

                pendingGames.push(gameObj)
            })

        })

        socket.on("player:ready", function(data)
        {
            console.log("Player " + data.player.username + " is ready!")

            var game = _.find(pendingGames, function(pendingGame){
                return pendingGame.roomID == data.room.id
            })

            if(game)
            {
                console.log("found game!")
                data.player.score = 0
                game.players.push(data.player)
                socket.join(game.id)
                if(game.players.length == data.room.playersPerGame)
                {
                    console.log("that's enough! starting game")
                    console.log(game)
                    gameManager.createGame(game.id, game.roomID, game.players, function(gameObj)
                    {
                        console.log("quiz created, sending questions to clients")
                        console.log("Getting the room and sending questions to clients");
                        io.to(gameObj.id).emit("quiz:started", gameObj)
                        gameManager.startGame(gameObj.id)
                    })
                }

                else

                {
                console.log("not ready, we have "+ game.players.length + "players but need " + data.room.playersPerGame)
                io.emit("player:gameready", game.id)
                }
            }
            else

            {

                console.log("could not find game")
                io.to(socket.handshake.session.socketID).emit("error",
                    {'title' : 'Game Join Error',
                    'text' : 'Could not find game'
                    })
            }
        })

        socket.on("player:unready", function(data)
        {
            var game = _.find(pendingGames, function(pendingGame){
                return pendingGame.roomID == data.room.id
            })
            if(game)
            {
                console.log(game)
                game.players = _.without(game.players, data.player.id)
                io.to(game.roomID).emit("player:gameleft", game.id)
            }
        })

        socket.on("quiz:start", function(pendingGame)
        {
            console.log("creating game " + pendingGame.id)
                gameManager.createGame(pendingGame.roomID, pendingGame.players, function(gameObj)
                {
                    console.log("quiz created, sending questions to clients")
                    console.log("Getting the room and sending questions to clients");
                    io.to(gameObj.roomID).emit("quiz:started", gameObj)

                })
        })

        socket.on("quiz:answer", function(answer)
        {
            answer.socketID = socket.id
            gameManager.checkAnswer(answer,function(response)
            {
                    if (response == "complete")
                    {
                        console.log("complete")
                        console.log("Room answer ID is" + answer.gameID)
                        gameManager.tallyResults(answer.gameID)

                    }
                    else
                    {
                        console.log("pending!!!")
                        //send a "proccessing" response
                        console.log(answer)

                        io.to(socket.handshake.session.socketID).emit("quiz:result", "pending")
                    }
            })

        })

        socket.on("logout", function()
        {
            console.log("logout!")
            console.log(socket.handshake.session)
            io.to(socket.id).emit("redirect", {"redirect" : "/"})
            socket.handshake.session.destroy();

        })


    })

    app.get("/pendinggames", function(req, res){
        res.json(pendingGames)
    })





}

