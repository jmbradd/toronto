/**
 * Created by jmbradd on 12/12/2015.
 */


var _ = require('lodash')
var questions = require('./data/questions')
var gameTypes = require('./data/gametypes')

var games = []

module.exports = function(app, io, mongoose, roomManager, assholeHost)
{


    module.exports.createGame = function (gameID, roomID, players, callback)
    {
        console.log("creating a quiz")
        _game = new gameTypes.democracy(gameID, players, roomID, 5);
        console.log(_game)
        _game.getQuestions(function(){
            console.log("got questions!")
            _game.Scores = players
            games.push(_game)
            getSanitizedGame(_game, function(gameObj)
            {
                callback(gameObj)
            })
        })
    }

    module.exports.getGames = function ()
    {
        return games;
    }

    module.exports.checkAnswer = function(answer, callback)
    {
        console.log(answer)

        var _game = _.find(games, function(game)
        {
            return game.id == answer.gameID
        });

        if(_game)
        {
            _game.checkAnswer(answer, function(result){
                addScore(answer)
                callback(result)
            })

        }
        else
        {
            console.log("how did you get here? that game doesn't exist")
        }

    }

    module.exports.tallyResults = function(gameID)
    {

        var _game = _.find(games, function(game)
        {
            return game.id == gameID
        })



        _.forEach(_game.Answers, function(result, index)
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

    module.exports.startGame = function(gameID){

        game = _.find(games, function(game){
            return game.id == gameID
        })
        if(game)
        {
            console.log("game " + game.id + " has begun!")
            var question = _.find(game.Questions, function(question){
                return question.round == game.currentRound
            })

            io.to(game.id).emit("quiz:question", {'question' : question, 'scores' : game.Scores})
        }
        else
        {
            console.log("Error: Could not find game")
        }
    }

    var continueGame = function(gameID)
    {
        console.log("game " + gameID + " is moving on to the next round")
        game = _.find(games, function(game){
            return game.id == gameID
        })


        //clear previous rounds answers
        game.Answers = []
        game.currentRound += 1

        if (game.currentRound > game.questionLimit)
        {
            gameOver(gameID)
        }
        else
        {
            _question =  _.find(game.Questions, function(question){
                return question.round == game.currentRound
            })
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

        io.to(_game.id).emit("gameover", _game.Scores)
    }

    var addScore = function(answer)
    {
        var game = _.find(games, function(game){
            return game.id == answer.gameID
        })

        var scoreObj = _.find(game.Scores, function(player)
        {

            return player.playerID == answer.playerID
        })

        scoreObj.score += answer.points
    }


}

