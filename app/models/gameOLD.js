/**
 * Created by jmbradd on 1/27/2016.
 */

var _ = require('lodash')

module.exports.game(id, players, roomID)
{
        this.self = this,
            this.id = id,
        this.roomID= roomID,
        this.Players= players,
        this.teams = {
            team1: [],
            team2: []
    },
        this.Questions= [],
            this.Answers= [],
        this.Scores= {
            team1 : [],
            team2 : []
    },
            this.questionLimit = 5,
            this.currentRound= 1
    ,
            this.getSanitizedGame = function(){
                return {
                    "id" : this.id,
                    "roomID" : this.roomID,
                    "players" : this.players,
                    "teams" : this.teams,
                    "scores" : this.scores
                }
            },

            this.addScore = function(playerID, score)
            {
                var scoreObj = _.find(this.Scores, function(player)
                {
                    console.log(player)
                    return player.playerID == playerID
                })

                scoreObj.score += score
            }



}