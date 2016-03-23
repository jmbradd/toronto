/**
 * Created by jmbradd on 1/26/2016.
 */
var _ = require('lodash')
var questions = require('./questions')
var gameProto = require('.././models/game').Game
var mongoose = require('mongoose')
var io = require("socket.io")



    module.exports.democracy = function democracy(id, players, roomID, questionLimit){

        function Democracy()
        {
            gameProto.call(this)
        }

       Democracy.prototype  = Object.create(gameProto.prototype)
        Democracy.prototype.constructor = Democracy;
        var game = new Democracy()
        game.id = id
        //todo: fix the number of teams issue, this is a minor issue but a hindrance to progress so i'm hard coding to 1
        game.numTeams = 1
        game.Players = players
        game.roomID = roomID
        game.questionLimit = questionLimit
        game.round = {
            "question" : {},
            "team1" :
                {"true" : 0,
                "false" : 0}
            ,
            "team2" :
                {"true" : 0,
                "false" : 0}

        }
        game.Scores = {
            'team1' : 0,
            'team2' : 0
        }

        game.getQuestions = function (callback)
        {
            console.log("looping")
                for (var i = 0; i < this.questionLimit; i++) {

                    var question = questions.questions.global[i]
                    question["round"] = i + 1;
                    this.Questions.push(question)
                    console.log("loaded question " + questions.questions.global[i].text)
                    if (this.Questions.length == this.questionLimit) {
                        console.log("questions fully loaded!")
                        callback()
                    }
                }


        }
        game.submitAnswer = function(answer, callback)
        {
            console.log(this.id, "is logging an answer")
            game.answerBox.push(answer)
            if(game.answerBox.length == game.Players.length)
            {
               callback("complete")
            }

            else
            {
               callback("pending")
            }
        }

        game.endRound = function(callback)
        {
            console.log(game.id, "is ending a round")
            console.log("checking answers for correctness")
            game.checkAnswers(function()
            {
                console.log("answers checked!  Tallying scores")
                var team1 = null
                var team2 = null

                /*

                if(game.round.team1.true > game.round.team1.false)
                {
                    console.log("team 1 says true!")
                    team1 = true
                }
                else
                {
                    console.log("team 1 says false!")
                    team1 = false
                }

                if(game.round.team2.true > game.round.team2.false)
                {
                    team2 = true
                }
                else
                {
                    console.log("team 1 says false!")
                    team2 = false
                }
                */
                var counter = 0

                //todo: fix this shit

                _.forEach(game.Scores, function(team)
                {
                    var currentTeam = "team"+(counter+1)
                    console.log("current team being evaluated is: ", currentTeam)
                    console.log("true votes",game.round[currentTeam].true)
                    console.log("false votes", game.round[currentTeam].false)
                    if(game.round[currentTeam].true > game.round[currentTeam].false)
                    {
                        console.log(currentTeam," says true!")
                        _answer = true

                        console.log("answer is", game.round.question.answer)
                        if(_answer == game.round.question.answer)
                        {
                            game.Scores[currentTeam]++
                            if(counter == game.numTeams)
                            {
                                callback(game.scores)
                            }

                            else
                            {
                                counter++
                            }
                        }

                        else
                        {
                            if(counter == game.numTeams)
                            {
                                callback(game.scores)
                            }

                            else
                            {
                                counter++
                            }
                        }
                    }

                    else
                    {
                        console.log(currentTeam," says false!")
                        _answer = false
                        if(_answer == game.round.question.answer)
                        {
                            game.Scores[currentTeam]++

                            if(counter == game.numTeams)
                            {
                                callback(game.scores)
                            }

                            else
                            {
                                counter++
                            }

                        }

                        else
                        {
                            if(counter == game.numTeams)
                            {
                                callback(game.scores)
                            }

                            else
                            {
                                counter++
                            }
                        }
                    }
                })
                /*

                if(team1 == game.round.question.answer)
                {
                    console.log("team1 got it right")
                    game.Scores.team1++
                }
                if(team2 == game.round.question.answer)
                {
                    game.Scores.team2++
                    console.log("calling back results!")
                    callback(game.Scores)
                }
                else
                {
                    console.log("calling back results!")
                    callback(game.Scores)
                }
                */

            })


        }
        game.checkAnswers = function(callback)
        {
            console.log("checking answers for the DEMOCRACY game mode")
            var evalprogress = 0

            for(answer in game.answerBox)
            {
                console.log("checking", answer)
                var ans = game.answerBox[answer]
                console.log(ans)
                if (ans.team == "team1")
                {
                    if(ans.response == true)
                    {
                        console.log("it correctly identified team1 as true!")
                        game.round.team1.true++
                        evalprogress++
                    }
                    else
                    {
                        game.round.team1.false++
                        evalprogress++
                    }
                }

                else
                {
                    // do team 2 stuff duh
                    if(ans.response == true)
                    {
                        game.round.team2.true++
                        evalprogress++
                    }
                    else
                    {
                        game.round.team2.false++
                        evalprogress++
                    }
                }
                if (evalprogress == game.Players.length)
                {
                    console.log("everything is done")
                    callback()
                }
            }

        }

        game.resetRound = function()
        {
            game.round = {
                "question" : {},
                "team1" :
                {"true" : 0,
                    "false" : 0}
                ,
                "team2" :
                {"true" : 0,
                    "false" : 0}
            }
        }
/*
        game.checkAnswer = function (answer, callback)
        {
                var _question = _.find(this.Questions, function (question)
                {

                    return question.id == answer.questionID
                });

                if (_question)
                {

                    var _total = Answers.length + 1


                    if (_total == this.Players.length)
                    {
                        answer.status = "complete"
                        if (answer.response == _question.answer)
                        {
                            answer.points = 1
                            callback(answer)
                        }
                        else
                        {
                            answer.points = 0
                            callback(answer)
                        }

                    }
                    else
                    {
                        answer.status = "pending"

                        if (answer.response == _question.answer)
                        {
                            answer.points = 1
                            callback(answer)
                        }
                        else {
                            answer.points = 0
                            callback(answer)
                        }
                    }
                }
                else {
                    console.log("no question there!")
                }
            }

            game.submitAnswer = function (answer)
            {
                this.Answers.push(answer)
            },
 */

            game.getResult = function (player, socketID, callback) {
                var _answer = _.find(this.Answers, function (answer) {
                    return answer.playerID == player.id
                });


                io.to(player.socketID).emit("quiz:result", _answer)

            }

            game.gameComplete = function ()
            {
                this.Answers = []
                this.Questions = []
            }

        return game;

        }

module.exports.autocracy = function (id, players, roomID){

    function Autocracy()
    {
        gameProto.call(this)
    }

    Autocracy.prototype  = Object.create(gameProto.prototype)
    Autocracy.prototype.constructor = Autocracy;
    var game = new Democracy()
    console.log("Is game an instance of Autocracy?", game instanceof Autocracy)
    console.log(game)
    game.id = id
    game.Players = players
    game.roomID = roomID
    game.getQuestions = function (callback)
    {
        console.log("looping")
        for (var i = 0; i < this.questionLimit; i++) {
            var question = questions.questions.global[i]
            question["round"] = i + 1;
            this.Questions.push(question)
            console.log("loaded question " + questions.questions.global[i].text)
            if (this.Questions.length == this.questionLimit) {
                console.log("questions fully loaded!")
                callback()
            }
        }


    }

    game.nextQuestion = function ()
    {
        return this.Questions.shift()
    }

    game.checkAnswer = function (answer, callback)
    {
        var _question = _.find(this.Questions, function (question)
        {

            return question.id == answer.questionID
        });

        if (_question)
        {

            var _total = Answers.length + 1


            if (_total == this.Players.length)
            {
                answer.status = "complete"
                if (answer.response == _question.answer)
                {
                    answer.points = 1
                    callback(answer)
                }
                else
                {
                    answer.points = 0
                    callback(answer)
                }

            }
            else
            {
                answer.status = "pending"

                if (answer.response == _question.answer)
                {
                    answer.points = 1
                    callback(answer)
                }
                else {
                    answer.points = 0
                    callback(answer)
                }
            }
        }
        else {
            console.log("no question there!")
        }
    }

    game.submitAnswer = function (answer)
    {
        this.Answers.push(answer)
    },

        game.getResult = function (player, socketID, callback) {
            var _answer = _.find(this.Answers, function (answer) {
                return answer.playerID == player.id
            });


            io.to(player.socketID).emit("quiz:result", _answer)

        }

    game.gameComplete = function ()
    {
        this.Answers = []
        this.Questions = []
    }

    return game;

}







