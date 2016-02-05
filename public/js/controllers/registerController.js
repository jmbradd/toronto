/**
 * Created by jmbradd on 2/4/2016.
 */
app.controller("registerController", ['$scope', 'quizService', 'socketService', 'userService', '$http', function($scope, quizService, socketService, userService, $http) {

    $scope.us = userService

    $scope.register = function(form){
        console.log("registering new user")
        $http.post('http://localhost:1967/register', form).success(function(err, data){
            if(err){
                console.log(err)
            }
            console.log(data)
        })
            .error(function(err){
                swal(
                    {   title: "Registration Failed",
                        text: err.message,
                        timer: 5000
                    })
            })
    }


}]);