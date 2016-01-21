/**
 * Created by jmbradd on 12/3/2015.
 */
    console.log("actually found the file")

var hostData = require("./data/greetings.json");

module.exports.getGreeting = function(playerType){
    console.log(playerType);

    var choices = hostData.greetings[playerType];
    var _greeting = { type: "message", 'user' : "asshole host", "text" : choices[0].text}
    console.log(_greeting);
    return _greeting;
}

module.exports.getResponseText = function(isCorrect, callback){

    var choices = hostData.results[isCorrect];
    var choice = Math.floor(Math.random() * choices.length);

    callback(choices[choice])


}