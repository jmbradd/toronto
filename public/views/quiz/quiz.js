/**
 * Created by jmbradd on 12/12/2015.
 */
angular.module('toronto.quiz', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/quiz', {
            templateUrl: './views/quiz/quiz.html',
            controller: 'quizController'
        });
    }]);