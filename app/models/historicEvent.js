/**
 * Created by jmbradd on 11/7/2015.
 */
var mongoose = require('mongoose');


var EventSchema =  new mongoose.Schema({
    year: Number,
    title: String,
    isTrue: Boolean,
    text: String

});

module.exports = mongoose.model('historicEvent', EventSchema, "events");