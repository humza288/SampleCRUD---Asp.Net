(function () {
    'use strict';

    angular
        .module('app')
        .controller('addTournamentCtrl', ['$scope', '$rootScope', '$filter', '$location', 'dataService', function ($scope, $rootScope, $location, $filter, dataService) {
            console.log("At the add tournament screen");

            // used to hold user data
            $scope.user = {};

            // get the user data from the root scope
            $scope.user.Email = $rootScope.username;
            $scope.user.Password = $rootScope.password;

            // used to check if a user is already enrolled in a tournament
            $scope.getTournament = function (tournamentName) {
                dataService.getTournament(tournamentName, $rootScope.username).then(function (result) {
                    console.log('Success in tournament lookup.');
                    console.log(result);
                    return result;
                }, function () {
                    console.log('Error in tournament lookup.');
                    return {};
                })
            }

            // used to add a user to a tournament
            $scope.addTournament = function (user, tournament) {
                dataService.getTournament(tournament.TournamentName, $rootScope.username).then(function (result) {
                    console.log('Success in tournament lookup.');
                    console.log(result);

                    if (result.TournamentName == tournament.TournamentName) {
                        console.log("Tournament already in database!");
                        toastr.error('Tournament already in database!');
                        return;
                    }

                    dataService.addTournament(user, tournament).then(function (result) {
                        toastr.success('Tournament Added');
                        $rootScope.goAccount();
                    }, function () {
                        toastr.error('Error in adding tournament');
                    });
                }, function () {
                    console.log('Error in tournament lookup.');
                    return null;
                })
            }
        }])
})();