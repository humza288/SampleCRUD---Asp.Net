(function () {
    'use strict';

    angular
        .module('app')
        .controller('accountCtrl', ['$scope', '$rootScope', '$filter', '$window', 'dataService', function ($scope, $rootScope, $filter, $window, dataService) {
            console.log("At the account screen");

            // order by tournament name as default
            $scope.orderBy = 'TournamentName';

            // default function used to get the dat for the hosted and
            // enrolled tournaments for a given user
            function getData() {
                dataService.getHostedTournaments($rootScope.username).then(function (result) {
                    $scope.$watch('searchTextOne', function (term) {
                        $scope.hostedTournaments = $filter('filter')(result, term);
                        console.log('Hosted Tournaments Retrieved');
                        console.log(result);
                    }, function () {
                        console.log('Error in retrieving hosted tournaments.');
                        return {};
                    });
                });

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

            // call the function when the view loads to populate the list
            getData();

            // function used to delete a hosted tournament
            $scope.deleteTournament = function (tournament) {
                console.log(tournament.TournamentName);
                console.log(tournament.HostEmail);
                dataService.deleteTournament({ 'Email': $rootScope.username, 'Password': $rootScope.password }, tournament).then(function (result) {
                    console.log('Tournament Deleted');
                    toastr.warning('Tournament deleted: ');
                    getData();
                }, function () {
                    console.log('Error in deleting tournament.');
                    toastr.error('Error in deleting tournament.');
                })
            }

            // function used to delete a user
            $scope.deleteUser = function () {
                dataService.deleteUser($rootScope.username).then(function (result) {
                    console.log('User Deleted: ' + $rootScope.username);
                    toastr.warning('User deleted: ' + $rootScope.username + '.');
                    $rootScope.logOut();
                }, function () {
                    console.log('Error in deleting user.');
                    toastr.error('Error in deleting user.');
                })
            }

            // function used to leave a enrolled tournament
            $scope.leaveTournament = function (tournament) {
                console.log("Leaving tournament: " + tournament);
                dataService.leaveTournament($rootScope.username, tournament).then(function (result) {
                    console.log('Success in leaving tournament.');
                    toastr.success('Success in leaving tournament.');
                    getData();
                    return result;
                }, function () {
                    console.log('Error in leaving tournament.');
                    toastr.error('Error in leaving tournament.');
                    return {};
                })
            }

            // function used to generate a crystal report for all tournaments
            $scope.generateTournamentsReport = function () {
                dataService.generateTournamentsReport().then(function (result) {
                    var blob = new Blob([result.data], { type: 'application/pdf' });
                    var downloadLink = angular.element('<a></a>');
                    var url = $window.URL || $window.webkitURL;

                    downloadLink.attr('href', url.createObjectURL(blob));
                    downloadLink.attr('download', 'tournamentsReport');
                    downloadLink[0].click();

                    console.log('Generated tournament report.');
                    toastr.success('Generated tournament report.');
                }, function () {
                    console.log('Error in generating report for all tournaments.');
                    toastr.error('Error in generating report for all tournaments.');
                })
            }

            // function used to generate a reports for the user
            // including enrolled and hosted tournaments.
            $scope.generateUserReport = function () {
                dataService.generateUserReport($rootScope.username).then(function (result) {
                    var blob = new Blob([result.data], { type: 'application/pdf' });
                    var downloadLink = angular.element('<a></a>');
                    var url = $window.URL || $window.webkitURL;

                    downloadLink.attr('href', url.createObjectURL(blob));
                    downloadLink.attr('download', 'userReport');
                    downloadLink[0].click();

                    console.log('Generated user report.');
                    toastr.success('Generated user report.');
                }, function () {
                    console.log('Error in generating report for user.');
                    toastr.error('Error in generating report for user.');
                })
            }
        }])
})();