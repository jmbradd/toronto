/**
 * Created by jmbradd on 11/28/2015.
 */
app.controller("userCtrl", ['$scope', '$rootScope', '$http', 'quizService', 'userService', 'socketService', '$cookies','$location', function($scope, $rootScope, $http, quizService, userService, socketService, $cookies, $location) {

    $scope.us = userService
    $scope.username = ""

    $scope.login = function(data)
    {
        $scope.username = data.username
        $http.post('http://localhost:1967/login', data).success(function(err, code, data){

            console.log("Response Code", code)
            console.log("Is there a third callback?", data)
            if(code === 200){
                console.log("login success!!")
                socketService.emit("bindsession", $scope.username)
            }

        }).error(function(err){
            $scope.username = ""
            swal(
                {   title: "Login Failed",
                    text: err,
                    timer: 5000
                })
        })

    }

    $scope.register = function(){
        $location.path('/register')
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