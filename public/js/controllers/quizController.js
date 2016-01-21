/**
 * Created by jmbradd on 12/12/2015.
 */
app.controller("quizController", ['$scope', 'quizService', 'socketService', 'userService', function($scope, quizService, socketService, userService) {

    $scope.qs = quizService
    $scope.questionStatus = "unanswered"
    $scope.us = userService
    $scope.answerPending = false

    $scope.sendMessage = function(form, roomID)
    {
        console.log(form)
        console.log(roomID)
        socketService.emit("message:gameroom", {'room' : roomID , 'user': $scope.us.user.username, 'text' : form.text})
        $scope.message = ""
    }

    $scope.answerQuestion = function(answer)
    {
        console.log("answering question!")
        $scope.questionStatus = "answered"
        console.log($scope.us.user.playerID)
        $scope.qs.answerQuestion(answer, $scope.us.user.playerID);
    }

    $scope.$on("error", function(error){
        swal({   title: error.title,
            text: error.text,
            timer: 5000 });
    })

    socketService.on("gameover", function(totals){
        console.log(totals)
        swal({
            title: "Game Over",
            html: 'hey there is text in here!'
        })
    })



    $scope.$on("quizresult", function()
    {
        var result = $scope.qs.result
        console.log(result)
        swal({   title: (result.points == 1) ? "Congrats!" : "Ouch",
                text: "Host: " + result.hostMessage.text,
                timer: 5000 });
        })



}]);