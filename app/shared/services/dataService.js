(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataService', ['$http', '$q', function ($http, $q) {

            var service = {};

            service.getUsers = function () {
                var deferred = $q.defer();
                $http.get('/User/Index').then(function (result) {
                    deferred.resolve(result.data);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            service.getUser = function (username) {
                console.log(username);
                var deferred = $q.defer();
                $http.get('/User/Details/?username=' + String(username)).then(function (result) {
                    console.log(result.data);
                    deferred.resolve(result.data);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            service.getTournaments = function () {
                var deferred = $q.defer();
                $http.get('/Tournament/IndexTournaments').then(function (result) {
                    deferred.resolve(result.data);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            service.getTournament = function (tournamentName, email) {
                var deferred = $q.defer();
                console.log("Looking up Tournament");
                console.log(email);
                console.log(tournamentName);
                $http.get('/Tournament/GetTournament?TournamentName='+String(tournamentName)+'&Email='+String(email)).then(function (result) {
                    deferred.resolve(result.data);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            service.getHostedTournaments = function (email) {
                var deferred = $q.defer();
                console.log(email);
                $http.get('/Tournament/GetHostedTournaments?username=' + String(email)).then(function (result) {
                    deferred.resolve(result.data);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };

            service.login = function (username, password) {
                console.log("Trying to Sign in: " + username);
                var deferred = $q.defer();
                $http.get('/User/Login/?username='+String(username)+'&password='+String(password)).then(function (result) {
                    console.log(result.data);
                    deferred.resolve(result.data);
                }, function (result) {
                    console.log(result.data);
                    deferred.reject();
                });
                return deferred.promise;
            };

            service.addUser = function (user) {
                console.log(user.Email);
                var deferred = $q.defer();
                $http.post('/User/Create', user).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };

            service.addTournament = function (user, tournament) {
                console.log(tournament.TournamentName);
                console.log(tournament.RankField);
                var deferred = $q.defer();
                $http.post('/Tournament/AddTournament', { 'user': user, 'tournament': tournament }).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };

            service.deleteTournament = function (user, tournament) {
                console.log(tournament.TournamentName);
                console.log(tournament.RankField);
                var deferred = $q.defer();
                $http.post('/Tournament/DeleteTournament', { 'user': user, 'tournament': tournament }).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };

            service.editUser = function (user) {
                var deferred = $q.defer();
                $http.post('/User/EditUser', user).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };

            service.editTournament = function (tournament) {
                var deferred = $q.defer();
                $http.post('/Tournament/EditTournament', tournament).then(function () {
                    console.log('Tournament edit successful!');
                    deferred.resolve();
                }, function () {
                        console.log('Tournament edit failed!');
                        deferred.reject();
                });

                return deferred.promise;
            };

            service.joinTournament = function (username, tournament, value) {
                var deferred = $q.defer();
                $http.get('/Tournament/EnrollTournament?username=' + String(username)
                    + '&tournamentName=' + String(tournament)
                    + '&value=' + String(value)).then(function (result) {
                        deferred.resolve(result.data);
                    }, function () {
                        deferred.reject();
                    });
                return deferred.promise;
            };

            service.leaveTournament = function (username, tournament) {
                var deferred = $q.defer();
                $http.get('/Tournament/LeaveTournament?username=' + String(username) + '&tournamentName=' + String(tournament))
                    .then(function (result) {
                        deferred.resolve(result.data);
                    }, function () {
                        deferred.reject();
                    });
                return deferred.promise;
            };

            service.getEnrolledTournaments = function (username) {
                var deferred = $q.defer();
                $http.get('/Tournament/GetEnrolledTournaments?username=' + String(username))
                    .then(function (result) {
                        deferred.resolve(result.data);
                    }, function () {
                        deferred.reject();
                    });
                return deferred.promise;
            };

            service.getTournamentEnrollees = function (tournament) {
                var deferred = $q.defer();
                $http.get('/Tournament/GetTournamentEnrollees?tournamentName=' + String(tournament))
                    .then(function (result) {
                        deferred.resolve(result.data);
                    }, function () {
                        deferred.reject();
                    });
                return deferred.promise;
            };

            service.getAvailableTournaments = function (username) {
                var deferred = $q.defer();
                $http.get('/Tournament/IndexAvailableTournaments?username=' + String(username))
                    .then(function (result) {
                        deferred.resolve(result.data);
                    }, function () {
                        deferred.reject();
                    });
                return deferred.promise;
            };

            service.updateEnrollee = function (username, tournament, value) {
                var deferred = $q.defer();
                $http.get('/Tournament/UpdateEnrollee?username=' + String(username)
                    + '&tournamentName=' + String(tournament) + '&value=' + String(value))
                    .then(function (result) {
                        deferred.resolve(result.data);
                    }, function () {
                        deferred.reject();
                    });
                return deferred.promise;
            };

            service.deleteUser = function (username) {
                var deferred = $q.defer();
                $http.post('/User/Delete/?username='+String(username)).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };


            service.generateTournamentsReport = function () {
                var deferred = $q.defer();
                $http.get('/Reports/GenerateTournamentsReport/', {
                    responseType: "arraybuffer"
                }).then(function (response) {
                    deferred.resolve(response);
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };

            service.generateInduvidualTournamentReport = function (tournamentName) {
                var deferred = $q.defer();
                $http.get('/Reports/GenerateInduvidualTournamentReport/?TournamentName=' + String(tournamentName), {
                    responseType: "arraybuffer"
                }).then(function (response) {
                    deferred.resolve(response);
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };

            service.generateUserReport = function (userName) {
                var deferred = $q.defer();
                $http.get('/Reports/GenerateUserReport/?UserName=' + String(userName), {
                    responseType: "arraybuffer"
                }).then(function (response) {
                    deferred.resolve(response);
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };

            return service;
        }]);
})();