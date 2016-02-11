/**
 * Created by jmbradd on 11/28/2015.
 */
app.controller("userCtrl", ['$scope', '$rootScope', '$http', 'quizService', 'userService', 'socketService', '$cookies','$location', function($scope, $rootScope, $http, quizService, userService, socketService, $cookies, $location) {

    $scope.us = userService
    $scope.username = ""


    $scope.register = function()
    {
        $location.path('/register')
    }

    $scope.login = function(data)
    {
        $scope.us.login(data, function(response){
            console.log(response)
            if(response.rescode == 200)
            {
                $scope.username = response.username
                socketService.emit("bindsession", {username: response.resdata.username, passportid: response.resdata.passportid})

            }
            else
            {
                swal({title: "Error", text: response})
            }

            console.log(response)
        })

    }



    $scope.logout = function()
    {
        socketService.emit("logout");
        $scope.us = {}
    }

    socketService.on("redirect", function(data)
    {
        console.log("redirect message caught");
        $location.path(data.redirect);
    })


}]);