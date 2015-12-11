/**
 * Created by jmbradd on 11/28/2015.
 */
app.factory("userService", function($http, $rootScope, $location, $cookies, socketService){

    var username = "not logged in";
    var rooms = [];
    var service = {};

    service.getUser = function(){
        return userName;
    };

    service.getRooms = function(){
        return rooms;
    };

    service.setUser = function(username){
        userName = username;
        $rootScope.$broadcast("refreshuser");
    };

    service.addRoom = function(room){
        rooms.push(room);
        $rootScope.$broadcast("refreshuser");
    };


    return service;
});