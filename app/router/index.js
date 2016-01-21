/**
 * Created by jmbradd on 11/7/2015.
 */


var event = require("../models/historicEvent");
var mongoose = require("mongoose");
var roomManager = require("../components/roomManager");
var path = require('path');
var socketManager = ("../components/socketManager")
var gameManager = require("../components/gameManager")

module.exports = function(app, io){



    app.get('/', function(req, res, next){
        if (req.username){
            console.log("user " + req.session.username + " is already logged in");
        }

    });

    app.get("/initialize", function(req, res)
    {
        if(req.session.username)
        {
            var userData =
            {
                "username" : req.session.username,
                "socketID" : req.session.socketID
            }

            io.to(req.session.socketID).emit("redirect", {"redirect" : "/lobby"})

            res.json(userData);
        }
        else
        {
            res.send(
                {"username": "no session exists"});
        }
    });


    app.post("/join", function(req,res){
        console.log("Current user is " + req.session.username);


        if(req.session.username)
        {
            console.log("user " + req.session.username+" is already connected");
            res.send(
                {
                    "redirect" : "/lobby",
                    "sid" : req.sessionID
                });
        }
        else
        {
            console.log("User " + req.body.username + " has connected");
            var player = roomManager.createPlayer(req.sessionID, req.body.username, req.session.socketID);
            req.session.username = req.body.username;
            console.log("Socket ID is" + req.session.socketID);
            //req.session.rooms = [];
            res.json(
                {"redirect" : "lobby",
                 "username" : req.session.username,
                    "socketID" : req.session.socketID,
                    "rooms" : []
                });
        }

        if(req.session.socketID)
        {
            console.log("socket ID already bound")
        }
        else{

        }
    });

    app.get("/join/:room", function(req,res){

        var player = roomManager.getPlayer(req.sessionID);
        roomManager.joinRoom(req.params.room, player.id);
        console.log("User " + req.session.username + " is joining " + req.params.room );
        res.send({ message: "joined"});

    });

    app.get("/event", function(req,res){


      event.findOne(function(err, events){
          if(err)
            res.send(err);

          res.json(events);
      })

    });

    app.post("/events/new", function(req, res)
    {
        var newEvent = new event();


        newEvent.title = req.body.title;
        newEvent.question = req.body.question;
        newEvent.answer = req.body.answer;

        newEvent.save(function(err){
            if(err) {console.log(err)}
            console.log("saved");
        });


    });

    app.post('/validate', function(req,res){
        var answer = req.body.answer;
        var event = req.body.event;

    });

    app.get('/rooms', function(req, res){

        console.log("entered")

        var rooms = roomManager.getRooms();
        var _response = { "rooms" : rooms};

        res.json(_response);
    });

    app.get('/status', function(req, res){

        res.send(req.session)


    })
    app.get("/games", function(req, res){

        var games = gameManager.getGames();
        res.send(games);
    })

    app.get('/players', function(req, res){
        var players = roomManager.getPlayers();
        res.send(players);
    })

    app.get('*', function(req, res){
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });



}
