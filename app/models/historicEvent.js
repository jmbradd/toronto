/**
 * Created by jmbradd on 11/7/2015.
 */
var mongoose = require('mongoose');


var EventSchema =  new mongoose.Schema({
    year: Number,
    title: String,
    isTrue: Boolean,
    text: String,
    difficulty: Number,
    tracking: {
        useages: Array,
        answers: Array
    }

});

//before saving the document, reassess the difficulty
EventSchema.pre('save', function(doc)
{
    //check to see if length is under 20, if so, set the length accordingly
    var max;

    if (doc.tracking.answers.length >= 20)
    {
        max = 20
    }
    else
    {
        max = doc.tracking.answers.length
    }
    var correct = 0
    for(var i=0; i < max; i++ )
    {
        var ans = doc.tracking.answers[answer]
        if (ans.correct = true)
        {
            correct++
        }
        //this is really ugly.
        if(i == max)
        {
            var pct = (correct / max) * 100

            if ( pct > 0 &&  pct <= 20)
            {
                doc.difficulty = 5
            }
            else if ( pct > 20 && pct <= 40)
            {
                doc.difficulty = 4
            }
            else if ( pct > 40 && pct <= 60)
            {
                doc.difficulty = 3
            }
            else if ( pct > 60 && pct <= 80)
            {
                doc.difficulty = 2
            }
            else if ( pct > 80 )
            {
                doc.difficulty = 1
            }
        }
    }
})

module.exports = mongoose.model('historicEvent', EventSchema, "events");