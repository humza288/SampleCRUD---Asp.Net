(function () {
    'use strict';

    angular
        .module('app')
        .controller('tournamentEditCtrl', ['$scope', '$routeParams', '$rootScope', '$location', 'dataService', function ($scope, $routeParams, $rootScope, $location, dataService) {
            console.log($routeParams.name);

            $scope.tournament = null;

            // function used to get a specific tournament
            $scope.getTournament = function (user) {
                dataService.getTournament($routeParams.name, $rootScope.username).then(function (result) {
                    console.log("Tournament Fetch Success!");
                    console.log(result);
                    $scope.tournament = result;
                }, function () {
                    console.log("Tournament Fetch Failure!");
                })
            };

            // call to get the tournaments info
            $scope.getTournament();

            // function used to edit the tournaments info
            $scope.editTournament = function (tournament) {
                dataService.editTournament(tournament).then(function (result) {
                    console.log("Tournament edit success!");
                    toastr.success("Tournament edit success!");
                    $rootScope.goAccount();
                }, function () {
                    toastr.error("Tournament edit success!");
                    console.log("Tournament edit failure!");
                })
            };
        }]);
})();