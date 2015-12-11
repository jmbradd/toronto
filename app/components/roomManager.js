/**
 * Created by jmbradd on 11/23/2015.
 */
var _ = require('lodash')


var rooms = [
    {
        "id": 0,
        "name": "Carlton's Place",
        "players": [],
        "messages" : [],
        "mode": "democracy",
        "isRegional": false,
        "region": null,
        "maxPlayers": 6
    },
    {
        "id": 1,
        "name": "lobby",
        "players": [],
        "messages" : [],
        "mode": "autocracy",
        "isRegional": false,
        "region": null,
        "maxPlayers": 6
    }
];
var roomList = [];
var players = [];




module.exports.joinRoom = function(roomID, playerID, callback){

    console.log("player id is " + playerID )


    var _room = _.find(rooms, function(usr) {
        return usr.id == roomID
    });

    var _player = _.find(players, function(ply) {
        return ply.id == playerID
    });

    console.log(_player)


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

    callback({"room" : roomObj.id, "player" : playerObj})


}


module.exports.getRoom = function(roomID){
    //get room from room array

    return room;

};

module.exports.getRooms = function(){
    return rooms;
};

module.exports.createPlayer = function(id, username, socket){
    var _player = {
        "id" : id,
        "username" : username,
        "socketID" : socket,
        "rooms" : []
    };

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
        maxPlayers: 6
    };

    rooms.push(_room);
    updateRoomList();
};

module.exports.getPlayer = function(id){

    var _player = players.filter(function(player){
        return player.id == id
    });

    return _player[0];
};

module.exports.getPlayers = function(){
    return players;
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