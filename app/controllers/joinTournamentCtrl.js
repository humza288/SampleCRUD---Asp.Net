(function () {
    'use strict';

    angular
        .module('app')
        .controller('joinTournamentCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {
            console.log("At the join tournament screen");

            // variable to store all the tournaments
            $scope.allTournaments = null;

            // function used to get a list of all tournaments that can
            // be enrolled in by a given user
            $scope.getTournaments = function () {
                dataService.getAvailableTournaments().then(function (result) {
                    console.log('Success in getting all available tournaments.');
                    console.log(result);
                    $scope.allTournaments = result;
                    return result;
                }, function () {
                    console.log('Error in getting all available tournaments.');
                    return {};
                })
            }

            // intially call the default function to populate the
            // list with all available tournaments
            getData();

            // default function used to get all available tournaments
            function getData() {
                dataService.getAvailableTournaments($rootScope.username).then(function (result) {
                    $scope.$watch('searchText', function (term) {
                        console.log('Success in getting all available tournaments.');
                        $scope.allTournaments = $filter('filter')(result, term);
                    }, function () {
                        console.log('Error in getting all tournaments.');
                        return {};
                    });
                });
            }

            // function used to handle the user joining a specific tournament
            $scope.joinTournament = function (tournament, value) {
                console.log(value);
                console.log("Joining tournament: " + tournament + " with value " + value);
                dataService.joinTournament($rootScope.username, tournament, value).then(function (result) {
                    console.log('Success in joining tournament.');
                    toastr.success('Success in joining tournament.');
                    getData();
                    return result;
                }, function () {
                    console.log('Error in joining tournament.');
                    toastr.error('Error in joining tournament.');
                    return {};
                })
            }
        }])
})();