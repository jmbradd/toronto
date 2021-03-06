/**
 * Created by jmbradd on 11/23/2015.
 */
var _ = require('lodash')
var Game = require("../models/game")


var rooms = [
    {
        "id": 0,
        "name": "Carlton's Place",
        "players": [],
        "messages" : [],
        "mode": "democracy",
        "isRegional": false,
        "region": null,
        "status": "available",
        "playersPerGame": 2
    },
    {
        "id": 1,
        "name": "lobby",
        "players": [],
        "messages" : [],
        "mode": "autocracy",
        "isRegional": false,
        "region": null,
        "status": "available",
        "playersPerGame": 2
    }
];
var roomList = [];
var players = [];




module.exports.joinRoom = function(roomID, playerID, callback){




    var _room = _.find(rooms, function(usr) {
        return usr.id == roomID
    });

    var _player = _.find(players, function(ply) {
        return ply.id == playerID
    });




    var playerObj =  {"id" : _player.id,
        "username" : _player.username,
        "socketID" : _player.socketID
    }

    var roomObj = {
        "id" : _room.id,
        "name" : _room.name
    }

    _room.players.push(playerObj)

    _player.rooms.push(roomObj)

    callback({"room" : _room, "player" : playerObj})


}


module.exports.getRoom = function(roomID, callback){
    //get room from room array

    var _room = rooms.filter(function(room){
        return room.id == roomID;
    })
    callback(_room[0])
};

module.exports.getReadyRoom = function(roomID, playerID, callback){
    var _room = rooms.find(function(room){
        return room.id == roomID;
    })

    var _game = new Game(
        {
            initiatedBy: playerID,
            status: "Pending"
        })

    _game.save(function(err, game){
        console.log("new game created, ID is: ",game.id)

        var gameTemplate =
        {
            initiatedBy: playerID,
            status: "Pending",
            'id' : game.id,
            'roomID' : roomID,
            'playersNeeded' : _room.playersPerGame,
            players : []
        }

        callback(gameTemplate);


    })

}

module.exports.getRooms = function(){
    return rooms;
};

module.exports.createPlayer = function(id, username)
{
    var _player = {
        "id" : id,
        "username" : username,
        "rooms" : []
    };
    console.log("Player Created", _player)

    players.push(_player);

    return _player;

};


module.exports.createRoom = function(roomName, gameMode){
    var _room = {
        id: rooms.length + 1,
        name: roomName,
        players: [],
        messages: [],
        mode: gameMode,
        isRegional: false,
        region: null,
        status: "available",
        maxPlayers: 6
    };

    rooms.push(_room);
    updateRoomList();
};

module.exports.addMessage = function(message)
{
    console.log("adding room message")
    console.log(message);
    var _room = rooms.filter(function(room){
        return room.id == message.room;
    })

    _room[0].messages.push(message)
}

module.exports.getPlayer = function(id, data, callback){
    console.log("getting player with ID", id)

    var _player = players.filter(function(player){
        return player.id == id
    });

    callback({player:_player[0], data:data});
};

module.exports.getPlayerSocketID = function(id, callback){



    var _player = _.find(players, function(player){
        return player.id == id
    });


   callback(_player.socketID)
};

module.exports.updatePlayerSocketID = function(playerID, socketID)
{
    var _player = _.find(players, function (player) {
        return player.id == playerID
    });

    var i = players.indexOf(_player)
    console.log(i)

}

module.exports.getPlayers = function(roomID, callback){

    var _room = _.find(rooms, function(room)
    {
        return room.id == roomID;

    })

    typeof callback === 'function' && callback(_room.players);
}

var updateRoomList = function(){
    for (var i=0; i < rooms.length; i++){
        roomList.push(rooms[i].name);
    };
};

var closeRoom = function(roomID){
    var _index;

    for(var i=0; i < rooms.length; i++){
        if (rooms[i].id == roomID){
            rooms.splice(rooms.indexOf(rooms[i]),1);
        }
    }
};