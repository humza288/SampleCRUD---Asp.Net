(function () {
    'use strict';

    angular
        .module('app')
        .controller('dashboardCtrl', ['$scope', '$rootScope', '$filter', '$window', 'dataService', function ($scope, $rootScope, $filter, $window, dataService) {
            console.log("At the dashboard screen");

            // default view is for hosted
            $scope.hosted = true;

            // function used to toggle between hosted and enrolled
            $scope.toggleView = function () {
                $scope.hosted = !$scope.hosted;
            }

            // function used to get all enrolled tournaments
            $scope.getEnrolledTournaments = function () {
                dataService.getEnrolledTournaments($rootScope.username).then(function (result) {
                    $scope.$watch('searchTextTwo', function (term) {
                        $scope.enrolledTournaments = $filter('filter')(result, term);
                        console.log('Enrolled Tournaments Retrieved');
                        console.log(result);
                    }, function () {
                        console.log('Error in retrieving enrolled tournaments.');
                        return {};
                    });
                });
            }

            // function used to get all hosted tournaments
            $scope.getHostedTournaments = function () {
                dataService.getHostedTournaments($rootScope.username).then(function (result) {
                    console.log('Hosted Tournaments Retrieved');
                    $scope.hostedTournaments = result;
                    console.log(result);
                }, function () {
                    console.log('Error in retrieving hosted tournaments.');
                })
            }

            // pull all hosted tournaments at default
            $scope.getHostedTournaments();

            // function used to get the enrollees in each tournament
            $scope.getTournamentEnrollees = function (tournament) {
                dataService.getTournamentEnrollees(tournament.TournamentName).then(function (result) {
                    console.log('Tournament Enrollees Retrieved');
                    $scope.tournamentEnrollees = result;
                    $scope.currentTournament = tournament;
                    console.log(result);
                }, function () {
                    console.log('Error in retrieving tournament enrollees.');
                })
            }

            // default dataservice used to get all enrolled tournaments when the view loads
            dataService.getEnrolledTournaments($rootScope.username).then(function (result) {
                $scope.$watch('searchTextTwo', function (term) {
                    $scope.enrolledTournaments = result;
                    $scope.currentTournament = result[0];
                    $scope.getTournamentEnrollees($scope.currentTournament)
                }, function () {
                    console.log('Error in initializing tournament.');
                    return {};
                });
            });

            // function used to update enrollee score
            $scope.updateEnrollee = function (tournament, value) {
                dataService.updateEnrollee($rootScope.username, tournament, value).then(function (result) {
                    console.log('Score Updated.');
                    toastr.success('Score Update!');
                    console.log(result);
                    $scope.getTournamentEnrollees($scope.currentTournament);
                }, function () {
                    console.log('Error in updating score.');
                    toastr.error('Error in updating score.');
                })
            }

            // function used to remove an enrollee
            $scope.removeEnrollee = function (username, tournament) {
                console.log("Leaving tournament: " + tournament);
                dataService.leaveTournament(username, tournament).then(function (result) {
                    console.log('Enrollee removed.');
                    toastr.success('Enrollee removed.');
                    $scope.getTournamentEnrollees($scope.currentTournament);
                    return result;
                }, function () {
                    console.log('Error in removing enrollee.');
                    toastr.error('Error in removing enrollee.');
                    return {};
                })
            }

            // function used to generate an report for and induvidual tournament
            $scope.generateInduvidualTournamentReport = function () {
                dataService.generateInduvidualTournamentReport($scope.currentTournament.TournamentName).then(function (result) {
                    var blob = new Blob([result.data], { type: 'application/pdf' });
                    var downloadLink = angular.element('<a></a>');
                    var url = $window.URL || $window.webkitURL;

                    downloadLink.attr('href', url.createObjectURL(blob));
                    downloadLink.attr('download', 'tournamentReport');
                    downloadLink[0].click();

                    console.log('Generated tournament report.');
                    toastr.success('Generated tournament report.');
                }, function () {
                    console.log('Error in generating report.');
                    toastr.error('Error in generating report.');
                    return {};
                });
            }
        }])
})();