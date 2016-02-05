/**
 * Created by jmbradd on 2/3/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose')


var User =  new Schema({
    name: String,
    username: {type: String, required: true, unique: true},
    email: String,
    createRooms: Boolean,
    created_at: Date,
    updated_at: Date
});

User.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', User);