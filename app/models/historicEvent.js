/**
 * Created by jmbradd on 11/7/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var EventSchema = Schema({
    year: {type: Number},
    title: {type: String},
    isTrue: {type: Boolean},
    text: {type: String},
    _id: { type: ObjectId }

});

HistoricalEvent = mongoose.model('HistoricalEvent', EventSchema);



exports.eventModel = HistoricalEvent;