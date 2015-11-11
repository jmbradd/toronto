/**
 * Created by jmbradd on 11/10/2015.
 */

app.controller("triviaController", ['$scope', '$http', function($scope, $http)
{
    $http.get("./js/controllers/testdata.json")
        .then(function(data){
            $scope.questions = data.data;
            console.log($scope.questions);
        });



    $scope.displayQuestion = function(question){
        swal(
            {
                title: question.question

            });
    };

    $scope.startQuiz = function(){
        console.log("starting quiz");
        console.log($scope.questions.length);
        while($scope.questions.length > 0){
            var question = $scope.questions[0];
            swal({
                title: question.question,
                text: "What do you think?",
                type: 'input',
                showCancelButton: true,
                closeOnConfirm: true,
                animation: "slide-from-top"
            }, function(inputValue){
                if (inputValue.toLowerCase() === question.answer.toLowerCase()){
                    console.log("correct");
                    $scope.questions.pop();
                }
                else{
                    swal({
                        title: "Oops!",
                        text: "Turns out you are kind of bad at this"
                    });
                    $scope.questions.pop();
                }
            })
        }
    };


}]);