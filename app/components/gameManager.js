/**
 * Created by jmbradd on 12/12/2015.
 */

var _ = require('lodash')
var questions = require('./data/questions')
var gameTypes = require('./data/gametypes')
var Game = require('../models/game')

var games = []

module.exports = function(app, io, mongoose, roomManager, assholeHost)
{
    module.exports.createGame = function (gameID, roomID, players, callback)
    {
        console.log("creating a quiz")
        _game = new gameTypes.democracy(gameID, players, roomID, 5);
        _game.getQuestions(function(){
            console.log("got questions!, time to sort out teams")
            _game.sortTeams(function(){
               //_game.Scores.team1 = _game.teams.team1.members
               // _game.Scores.team2 = _game.teams.team2.members
                console.log("teams sorted, notifying players")
                notifyPlayers(_game.teams)
                games.push(_game)
                getSanitizedGame(_game, function(gameObj)
                {
                    callback(gameObj)
                })

            })

        })
    }

    module.exports.getGames = function ()
    {
        return games;
    }

    module.exports.submitAnswer = function(answer, callback)
    {
        console.log("game manager has recieved an answer")

        var _game = _.find(games, function(game)
        {
            return game.id == answer.gameID
        });

        if(_game)
        {
            _game.submitAnswer(answer, function(status){
               if(status == "complete")
               {
                   _game.endRound(function(scores)
                   {
                       callback(scores)
                   })

               }
               else
               {
                   console.log("answer recieved but we still need more responses")
                   callback("pending")
               }
            })

        }

        else
        {
            console.log("cannot find game ",answer.gameID)
            callback("error")
        }

    }

    module.exports.tallyResults = function(gameID)
    {

        var _game = _.find(games, function(game)
        {
            return game.id == gameID
        })


        _.forEach(_game.AnswerBox, function(result, index)
        {
            console.log(result)
            getHostMessage(result, function(message){
                console.log("host message is ", message)
                result.hostMessage = message
                console.log(result)
                io.to(result.socketID).emit("quiz:result", result);
            })

        })

        continueGame(gameID)
    }

    module.exports.startGame = function(gameID)
    {

        game = _.find(games, function(game){
            return game.id == gameID
        })
        if(game)
        {
            console.log("game " + game.id + " has begun!")
            var question = _.find(game.Questions, function(question){
                return question.round == game.currentRound
            })

            game.round.question = question

            io.to(game.id).emit("quiz:question", {'question' : question, 'scores' : game.Scores})
        }
        else
        {
            console.log("Error: Could not find game")
        }
    }

    module.exports.continueGame = function(gameID)
    {
        console.log("game " + gameID + " is moving on to the next round")
        game = _.find(games, function(game){
            return game.id == gameID
        })

        //clear previous rounds answers
        game.answerBox = []
        game.currentRound += 1
        game.resetRound()

        if (game.currentRound > game.questionLimit)
        {
            gameOver(gameID)
        }

        else
        {
            _question =  _.find(game.Questions, function(question){
                return question.round == game.currentRound
            })
            game.round.question = _question
            io.to(game.id).emit("quiz:question", {'question' : _question, 'scores' : game.Scores})
        }

    }

    var getHostMessage = function(answer, callback){
        var _game = _.find(games, function(game)
        {

            return game.id == answer.gameID
        });

        if(_game){



        var isCorrect = (answer.points != 0) ? "correct" : "incorrect"
        assholeHost.getResponseText(isCorrect, function(hostmessage){
            answer.hostMessage = hostmessage
            _game.Answers.push(answer)
            callback()
        })
        }
        else{
            console.log("what?  game not found")
        }

    }

    var getSanitizedGame = function(game, callback)
    {
        var sanitizedGame = {
            "id" : game.id,
            "roomID" : game.roomID,
            "players" : game.players,
            "teams" : game.teams,
            "scores" : game.scores
        }
        //callback unnecessary right now but i'll need it when I have to look up the game by ID
        //todo: provide option to look up game by ID
        callback(sanitizedGame)

    }

    var gameOver = function(gameID)
    {
        _game = _.find(games, function(game)
        {
            return game.id == gameID
        })

        Game.update({_id: _game.id},
            {
                status: "Complete",
                Scores: _game.Scores,
                updated_at: new Date()
            }, function(err)
            {
                if(err)
                {
                    console.log(err)
                }

                console.log("game ",_game.id," saved!")
            })

        _.remove(games, function(game){
            return game.id == _game.id
        })



        io.to(_game.id).emit("gameover", _game.Scores)
    }

    var addScore = function(answer)
    {
        //debugging
        console.log(answer)
        var game = _.find(games, function(game){
            return game.id == answer.gameID
        })
        var team = answer.team


        var scoreObj = _.find(game.Scores[team], function(player)
        {

            return player.playerID == answer.playerID
        })

        scoreObj.score += answer.points
    }

    var notifyPlayers = function(teams)
    {
        console.log(teams)
        for (var i= 0; i < teams.team1.members.length; i++)
        {
            player = teams.team1.members[i]
            console.log("notifying player ", player.username, "has been assigned to ", player.team)
            io.to(player.socketID).emit("teamassignment", player.team)
        }
        for (var i= 0; i < teams.team2.members.length; i++)

        {
            player = teams.team2.members[i]
            console.log("notifying player ", player.username, "has been assigned to ", player.team)
            io.to(player.socketID).emit("teamassignment", player.team)
        }
    }


}

