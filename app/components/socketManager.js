/**
 * Created by jmbradd on 12/11/2015.
 */

var roomManager = require("../components/roomManager")
var assholeHost = require("../components/assholeHost")

module.exports = function(app, io, server, sessionStore, sharedsession, sessions){

    io.use(sharedsession(sessions));

    io.on("connection", function(socket){
        console.log("user connected");

        console.log("sessionID is " + socket.handshake.sessionID)

        console.log(sessionStore);

        var _session = sessionStore.get(socket.handshake.sessionID, function(err, sess){
            if(err)
            {
                console.log(error)
            }
            else
            {
                return sess;
            }

        })


        socket.on("bindsession", function(data)
        {
            console.log("Binding socket " + socket.id + " and session " + socket.handshake.sessionID )
            socket.handshake.session.socketID = socket.id
            socket.handshake.session.username = data.username
            socket.handshake.session.save()
            console.log(socket.handshake.session)
            var player = roomManager.createPlayer(socket.handshake.sessionID, socket.handshake.session.username, socket.handshake.session.socketID)

            io.to(socket.id).emit("redirect", {"redirect" : "/lobby"})





        })

        socket.on("room:join", function(data)
        {
            console.log(socket.handshake.session.username + " is joining " + data.room )
            var player = roomManager.getPlayer(socket.handshake.sessionID);
            roomManager.joinRoom(data.room, player.id, function(data){
                socket.join(data.room)
                io.to(data.room).emit("playerjoined", data)
                var greeting = assholeHost.getGreeting("newPlayer");
                io.to(data.room).emit("message", { 'room' : data.room, "text" : greeting.text, "user" : "The Host"});

            });

        })

        socket.on("message:room", function(msg){
            console.log("room message recieved");
            console.log(msg);
            io.to(msg.room).emit("message", {'room' : msg.room, 'text' : msg.text, 'user' : msg.user})
        })
    })

}

