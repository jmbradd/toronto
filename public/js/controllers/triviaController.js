/**
 * Created by jmbradd on 11/10/2015.
 */

app.controller("triviaController", ['$scope', '$rootScope', '$http', 'quizService', function($scope, $rootScope, $http, quizService)
{
    $scope.currentRooms = [];
    $scope.question = quizService.question;

    $http.get("./js/controllers/testdata.json")
        .then(function(data){
            $scope.questions = data.data;
        });



    $scope.displayQuestion = function(question){
        swal({
            title: question.question,
            text: "What do you think?",
            type: 'input',
            showCancelButton: true,
            closeOnConfirm: true,
            animation: "slide-from-top"
        }, function (inputValue) {
            if (inputValue.toLowerCase() === question.answer.toLowerCase())
            {
                console.log("correct");
                $scope.questions.pop();
            }
            else
            {
                swal({
                    title: "Oops!",
                    text: "Turns out you are kind of bad at this",
                    timer: 2000
                })
            }

            }
        )};



    $scope.startQuiz = function()
    {
        $scope.quizRunning = true;
        quizService.fetchQuestion();
        $scope.question = quizService.getQuestion();


        console.log("question is " + $scope.question);
    };

    $scope.checkAnswer = function(answer)
    {
        console.log(answer);
        //evaluate if submitted answer was correct
        if($scope.questions[0].answer.toLowerCase === answer.answer.toLowerCase)
        {
            console.log("true");
            $scope.nextQuestion()
        }

        else
        {
            console.log("false")
            $scope.nextQuestion()
        }

    };

    $scope.nextQuestion = function(answer)
    {
        $scope.checkAnswer(answer);
        quizService.fetchQuestion();

    };

    $scope.quizEnd = function() {
        $scope.quizRunning = true;
    }

    $scope.getRooms = function(){
        quizService.getRooms().then(function(rooms){
            console.log("trivia controller getting rooms")
            console.log(rooms);
            $scope.currentRooms = rooms;
        })
    }
}]);

//sweet alerts code, keeping temporarily

/* if ($scope.quizRunning) {

var question = $scope.questions[0];
swal({
    title: question.question,
    text: "What do you think?",
    type: 'input',
    showCancelButton: true,
    closeOnConfirm: true,
    animation: "slide-from-top"
}, function (inputValue) {
    if (inputValue.toLowerCase() === question.answer.toLowerCase()) {
        console.log("correct");
        $scope.questions.pop();
    }
    else {
        swal({
            title: "Oops!",
            text: "Turns out you are kind of bad at this",
            timer: 2000
        });
        $scope.questions.pop();
        if ($scope.questions.length > 0)
        {

        }

        else
        {
            $socpe.quizRunning = false;
        }
    }
});
}
}
    */