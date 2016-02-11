/**
 * Created by jmbradd on 11/6/2015.
 */
var express = require('express');
var app = express();
var server = require('http').Server(app);
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookies = require('cookie-parser');
var expSessions = require('express-session');
var RedisStore = require('connect-redis')(expSessions);
var path = require('path');
var cors = require('cors');
var io = require('socket.io')(server);
var sharedsession = require('express-socket.io-session')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var assholeHost = require('./app/components/assholeHost')
var roomManager = require('./app/components/roomManager')
var gameManager = require('./app/components/gameManager')(app,io,mongoose, roomManager, assholeHost)
var userManager = require('./app/components/userManager')(app,io,mongoose)
var redis = require('redis')

var client = redis.createClient()
var sessionStore = new RedisStore({ host: 'localhost', port: 6379, client: client,  ttl : 10000});

var sessions = expSessions(
    {
        secret: "lol bees",
        resave: true,
        store: sessionStore,
        saveUninitialized: true
    });

app.use(sessions);

var socketManager = require('./app/components/socketManager')(app, io, server, sessionStore, sharedsession, sessions)

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));
app.use(cookies())
app.use(bodyParser.urlencoded({'extended' : 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(cors());
var User = require('./app/models/user')
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(passport.initialize())
app.use(passport.session())


/**io.use(sharedsession(sessions, {
    autoSave: true
}))
*/



//configuration

var dbConfig = require("./app/config/db");

//modules

var router = require("./app/router/")(app, io, passport);


mongoose.connect(dbConfig.url, {
    user: dbConfig.username,
    pass: dbConfig.password
});

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


server.listen(1967, function(){
    console.log("Server up and running on port 1967...toronto sucks");
});



