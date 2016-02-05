/**
 * Created by jmbradd on 1/27/2016.
 */

var _ = require('lodash')

module.exports.Game = function()
{
        //basic game attributes
        this.id = "",
        this.roomID = "",
        this.Players = "",
        this.teams = {
            team1: [],
            team2: []
        },
        this.Questions = [],
        this.Answers = [],
        this.Scores =
        {
            team1 : [],
            team2 : []
        },

        this.questionLimit = 0,
        this.currentRound = 1,

            // functions
            this.getSanitizedGame = function(){
                return {
                    "id" : id,
                    "roomID" : roomID,
                    "players" : players,
                    "teams" : teams,
                    "scores" : scores
                }
            },

            this.addScore = function(playerID, score)
            {
                var scoreObj = _.find(Scores, function(player)
                {
                    console.log(player)
                    return player.playerID == playerID
                })

                scoreObj.score += score
            },

            this.checkAnswer = function (answer, callback)
            {
                var _question = _.find(this.Questions, function (question)
                {

                    return question.id == answer.questionID
                });

                if (_question)
                {

                    var _total = this.Answers.length + 1


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
            },

                this.submitAnswer = function (answer)
                {
                    this.Answers.push(answer)
                },

                this.setMaxQuestions = function(maxQuestions){
                    this.questionLimit = maxQuestions
                },

                this.getResult = function (player, socketID, callback)
                {
                    var _answer = _.find(this.Answers, function (answer)
                    {
                        return answer.playerID == player.id
                    });

                    io.to(player.socketID).emit("quiz:result", _answer)

                }




}