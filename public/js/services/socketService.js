/**
 * Created by jmbradd on 11/10/2015.
 */
var sockets = angular.module("SocketService", []);

sockets.factory('socketService', function ($rootScope) {
    var socket = io.connect();
    console.log("socket service loading");

    var on = function (eventName, callback) {
        socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        });
    }

    var emit = function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        })
    }

    return {
        on: on,
        emit: emit
    }

});