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
            team1: {
                captain: null,
                members: []
            },
            team2: {
                captain: null,
                members: []
            },
        },
        this.Questions = [],
        this.Answers = [],
        this.Scores =
        {
            team1 : 0,
            team2 : 0
        },
        this.answerBox = [],
        this.questionLimit = 0,
        this.currentRound = 1,
        this.round = {},
            // functions
            this.getSanitizedGame = function(){
                return {
                    "id" : id,
                    "roomID" : roomID,
                    "players" : players,
                    "teams" : teams,
                    "scores" : this.Scores
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
                    this.submitAnswer(answer)


                    if (this.Answers.length == (this.teams.team1.members.length + this.teams.team2.members.length))
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
                this.sortTeams = function(callback)
                {
                    //I get it, this is a bit hacky but whatever, need to move on to the rest of the program =)
                    var team1Done = false
                    var team2Done = false

                    console.log(this.Players)
                    var players = _.shuffle(this.Players)
                    console.log("Players",players)
                    //split array based on number of players.  Using ceiling so that 1 player games don't crash.  Team 2 is better though.

                    this.teams.team1.members.push(_.first(players, Math.ceil(players.length/2)))
                    this.teams.team2.members = _.rest(players, Math.ceil(players.length/2))

                    console.log("players",this.teams.team1.members)
                    console.log("team2 length", this.teams.team2.members)



                    if( this.teams.team1.members)
                    {
                        console.log("teamlength",this.teams.team1.members.length)
                        var capt1 = Math.floor(Math.random() *( this.teams.team1.members.length))
                        console.log(capt1)
                        console.log(this.teams.team1.members[capt1])
                        this.teams.team1.captain = this.teams.team1.members[capt1]
                        this.teams.team1.members[capt1].isCaptain = true
                        for(player in this.teams.team1.members)
                        {
                            _player =  this.teams.team1.members[player]
                            _player.team = "team1"
                          //  io.to(_player.socketID).emit("teamassignment", "team1")
                            if(_player == this.teams.team1.members.length)
                            {
                                team1Done = true
                                if(team2Done == true)
                                {
                                    callback()
                                }
                            }
                        }
                    }

                    if( this.teams.team2.members.length > 0)
                    {
                        var capt2 = Math.floor(Math.random() *( this.teams.team2.members.length))
                        this.teams.team2.captain = this.teams.team2.members[capt2]
                        this.teams.team2.members[capt2].isCaptain = true
                        for(player in this.teams.team2.members)
                        {
                            console.log(player)
                            _player =  this.teams.team2.members[player]
                            _player.team = "team2"
                           // io.to(_player.socketID).emit("teamassignment", "team2")

                            if(_player == this.teams.team2.members.length)
                            {
                                team2Done = true
                                if(team1Done == true)
                                {
                                    callback()
                                }
                            }

                        }
                    }

                    callback()






                    //going to take a different approach, thanks to Brian's suggestion! Keeping this in here just in case I hate it

                    /*for(var i=this.Players.length; i>0; i--)
                    {
                        console.log("here yo are...")

                        var rand = Math.floor(Math.random() * this.Players.length)
                        _player = this.Players.splice(rand, 1)
                        _player = {
                            username: _player[0].username,
                            socketID: _player[0].socketID,
                            playerID: _player[0].playerID,
                            score: 0
                            }
                        console.log("now sorting",_player)
                        if(this.teams.team1.members.length > this.teams.team2.members.length)
                        {
                            console.log("adding", _player.username," to team 2")
                            _player.team = "team2"
                            //io.to(_player.socketID).emit("teamassignment", "team2")
                            this.teams.team2.captain = this.teams.team2.captain || _player
                            this.teams.team2.members.push(_player)
                        }
                        else
                        {
                            console.log("adding", _player.username," to team 1")
                            _player.team = "team1"
                            //io.to(_player.socketID).emit("teamassignment", "team1")
                            this.teams.team1.captain = this.teams.team1.captain || _player
                            this.teams.team1.members.push(_player)
                        }
                        if (this.Players.length <= 0)
                        {
                            callback()
                        }
                    }*/

                }




}