/**
 * Created by jmbradd on 12/12/2015.
 */


var _ = require('lodash')
var questions = require('./data/questions');
var games = []

module.exports = function(app, io, mongoose, roomManager, assholeHost)
{
    function democracy(id, players, _roomID)
    {
        return{
            self: this,

            //todo: implement unique ID for games
            id: id,
            roomID: _roomID,
            Players: players,
            teams: {
                team1: [],
                team2: []
            },
            Questions: [],
            Answers: [],
            Scores: {
                team1: [],
                team2: []
            },
            questionLimit: 5,
            currentRound: 1,


            getQuestions: function (callback)
            {
                for ( var i = 0;i<this.questionLimit;i++)
                {
                    var question = questions.questions.global[i]
                    question["round"] = i + 1;
                    this.Questions.push(question)
                    console.log("loaded question "+ questions.questions.global[i].text)
                    if (this.Questions.length == this.questionLimit){
                        console.log("questions fully loaded!")
                        callback()
                    }
                }

            },
            nextQuestion: function(){
                return this.Questions.shift()
            },

            checkAnswer: function(answer, callback)
            {
                var _question = _.find(this.Questions, function(question)
                {

                    return question.id == answer.questionID
                });

                if(_question)
                {
                    console.log("question is ")
                    console.log(_question)
                var _total = this.Answers.length + 1

                if (_total == this.Players.length )
                {
                    if (answer.response == _question.answer)
                    {
                        answer.points = 1
                        addScore(answer.gameID, answer.playerID, answer.points)
                        console.log(answer)
                        getHostMessage(answer, function()
                        {
                            callback("complete")
                        })
                    }
                    else
                    {
                        answer.points = 0
                        addScore(answer.gameID, answer.playerID, answer.points)
                        getHostMessage(answer, function()
                        {
                            callback("complete")
                        })
                    }

                }
                else
                {

                    if (answer.response == _question.answer)
                    {
                        answer.points = 1
                        addScore(answer.gameID, answer.playerID, answer.points)
                        getHostMessage(answer, function()
                        {
                            callback("pending")
                        })
                    }
                    else
                    {
                        answer.points = 0
                        addScore(answer.gameID, answer.playerID, answer.points)
                        getHostMessage(answer, function()
                        {
                            callback("pending")
                        })
                    }
                }
            }
                else
                {
                    console.log("no question there!")
                }
            },

            submitAnswer : function(answer){
                this.Answers.push(answer)
            },

            getResult : function(player, socketID, callback)
            {
                var _answer = _.find(this.Answers, function(answer)
                {
                    return answer.playerID == player.id
                });


                io.to(player.socketID).emit("quiz:result", _answer)

            },
            gameComplete: function(){
                this.Answers = []
                this.Questions = []
            }
        }
    }

    module.exports.createGame = function (gameID, roomID, players, callback) {
        console.log("creating a quiz")
        _game = new democracy(gameID, players, roomID);
        _game.getQuestions(function(){
            console.log("got questions!")
            _game.Scores = players
            games.push(_game)
            getSanitizedGame(_game, function(gameObj){
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
                callback(result)
            })

        }
        else
        {
            console.log("how did you get here? that game doesn't exist")
        }

    }

    module.exports.tallyResults = function(gameID){

        var _game = _.find(games, function(game)
        {
            return game.id == gameID
        })



        _.forEach(_game.Answers, function(result, index)
        {
            io.to(result.socketID).emit("quiz:result", result);
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
            console.log(question)
            console.log(game.Questions.length)
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
        _game = _.find(games, function(game){
            return game.id == gameID
        })

        io.to(_game.id).emit("gameover", _game.Scores)
    }

    var addScore = function(gameID, playerID, score)
    {
        console.log("gameID " + gameID)
        console.log("playerID " + playerID)
        console.log("score " + score)

        var game = _.find(games, function(game){
            return game.id == gameID
        })

        var scoreObj = _.find(game.Scores, function(player)
        {
            console.log(player)
            return player.playerID == playerID
        })

        scoreObj.score += score
    }


}

