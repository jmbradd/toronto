/**
 * Created by jmbradd on 2/8/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose')


var Game =  new Schema({
    initiatedBy: String,
    status: String,
    gameType: String,
    players: Array,
    Scores: Array,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('Game', Game);