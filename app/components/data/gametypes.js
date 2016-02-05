/**
 * Created by jmbradd on 1/26/2016.
 */
var _ = require('lodash')
var questions = require('./questions')
var gameProto = require('.././models/game').Game


    module.exports.democracy = function democracy(id, players, roomID, questionLimit){

        function Democracy()
        {
            gameProto.call(this)
        }

       Democracy.prototype  = Object.create(gameProto.prototype)
        Democracy.prototype.constructor = Democracy;
        var game = new Democracy()
        console.log("Is game an instance of Democracy?", game instanceof Democracy)
        console.log(game)
        game.id = id
        game.Players = players
        game.roomID = roomID
        game.questionLimit = questionLimit
        game.getQuestions = function (callback)
        {
            console.log("looping")
                for (var i = 0; i < this.questionLimit; i++) {
                    console.log("iteration ",i)
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







