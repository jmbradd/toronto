/**
 * Created by jmbradd on 11/28/2015.
 */
app.factory("userService", function($http, $rootScope, $location, $cookies, socketService){



    var service = {};

    service.loggedIn = false
    service.user = {}
    service.playersConnected = 0

    service.rooms = [];

    service.getUser = function(){
        return service.user;
    };

    service.getRooms = function(){
        return service.rooms;
    };

    service.setUser = function(userObj){
        service.user = userObj;

    };

    service.login = function(data, callback)
    {

        $http.post('http://localhost:1967/login', data)
            .success(function(response, code)
            {
                console.log("response is",response)
                service.user.username = response.username
                service.user.passportid = response.passportid
                callback({resdata: response, rescode: code})

             })
            .error(function(err, code) {
                console.log(err)
                console.log(code)
                callback(err)
            })

    }



    socketService.on("userdata", function(data){
        console.log("recieved user data")
        console.log(data);
        service.user = data
        console.log(service.loggedIn)
        service.loggedIn = (data.username == "") ? false : true
        service.rooms = data.rooms
        console.log(service.loggedIn)
        $location.path(data.redirect);
    })

    socketService.on("socketcount", function(count){
        service.playersConnected = count;
    })


    return service;
});