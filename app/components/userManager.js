/**
 * Created by jmbradd on 2/3/2016.
 */
var User = require('../models/user')


module.exports = function(app,io,mongoose) {

//var coug = new User({
    //   name: "James Bradd",
    //   username: 'cougarr',
    //   password: 'password'
//})

//coug.save(function(err)
    //   {
    //  if(err) throw err;
    //   console.log('added user successfully!')
//    })
    module.exports.login = function(data, callback)
    {
        passport.authenticate('local')

    }
    module.exports.createUser = function (data) {
        var _user = new User({
            name: data.name,
            username: data.username,
            password: data.password
        })

        _user.save();
    }

    module.exports.grantRoomRights = function (user) {
        //grant create room rights to user
    }
}