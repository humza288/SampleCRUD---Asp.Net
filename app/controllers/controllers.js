(function () {
    'use strict';

    angular
        .module('app')
        .controller('welcomeCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {
            console.log("At the welcome screen");

        }])
        .controller('dashboardCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {
            console.log("At the dashboard screen");

            $scope.hosted = true;

            $scope.toggleView = function () {
                $scope.hosted = !$scope.hosted;
            }

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

            $scope.getHostedTournaments = function () {
                dataService.getHostedTournaments($rootScope.username).then(function (result) {
                    console.log('Hosted Tournaments Retrieved');
                    $scope.hostedTournaments = result;
                    console.log(result);
                }, function () {
                    console.log('Error in retrieving hosted tournaments.');
                })
            }

            $scope.getHostedTournaments();

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

        }])
        .controller('accountCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {
            console.log("At the account screen");

            $scope.orderBy = 'TournamentName';

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

            getData();

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

        }])
        .controller('loginCtrl', ['$scope', '$rootScope', '$filter', '$location', 'dataService',
            function ($scope, $rootScope, $filter, $location, dataService) {
                console.log("At the login screen");
                $scope.login = function (username, password) {
                    dataService.login(username, password).then(function (result) {
                        if (result.Email != username || result.Password != password) {
                            console.log('Sign in failure.');
                            toastr.error('Invalid credentials.');
                        }
                        console.log('User login success: ' + result.Email);
                        toastr.success('User login success: ' + result.Email + '.');
                        $rootScope.signedIn = true;
                        $rootScope.username = result.Email;
                        $rootScope.password = result.Password;
                        $rootScope.storeUserCookie();
                        $location.path('/');
                    }, function () {
                        console.log('Sign in failure.');
                        toastr.error('Invalid credentials.');
                    });
                }
            }])
        .controller('joinTournamentCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {

            console.log("At the join tournament screen");
            $scope.allTournaments = null;

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

            getData();

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
        .controller('addTournamentCtrl', ['$scope', '$rootScope', '$filter', '$location', 'dataService', function ($scope, $rootScope, $location, $filter, dataService) {
            console.log("At the add tournament screen");

            $scope.user = {};

            $scope.user.Email = $rootScope.username;
            $scope.user.Password = $rootScope.password;

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
        .controller('signUpCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {

            console.log("At the signup screen");

            $scope.viewUser = function (user) {
                console.log(user.Email);
                console.log(user.Password);
            }

            $scope.signUpUser = function (user) {
                console.log("Processing Signup: ");

                dataService.getUser(user.Email).then(function (result) {
                    if (result.Email == user.Email) {
                        console.log('User Already Exists!');
                        toastr.error('User Already Exists!');
                        return;
                    }
                    else {
                        dataService.addUser(user).then(function () {
                            $rootScope.signedIn = true;
                            $rootScope.username = user.Email;
                            $rootScope.password = user.Password;
                            $rootScope.storeUserCookie();
                            $rootScope.goHome();
                            toastr.success('User Created: ' + $rootScope.username + '.');
                        }, function () {
                            toastr.error('Error in creating user');
                            toastr.error('Error in creating user.');
                        });
                    }
                });
            };

            /*$scope.signUpUser = function (user) {
                console.log("Processing Signup: ");

                dataService.addUser(user).then(function () {
                    $rootScope.signedIn = true;
                    $rootScope.username = user.Email;
                    $rootScope.password = user.Password;
                    $rootScope.storeUserCookie();
                    $rootScope.goHome();
                    toastr.success('User Created: ' + $rootScope.username + '.');
                }, function () {
                    toastr.error('Error in creating user');
                    toastr.error('Error in creating user.');
                });
            }*/
        }])
        .controller('userCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {
            $scope.users = [];
            $scope.currentPage = 1;
            $scope.itemsPerPage = 2;

            console.log($rootScope.signedIn);

            //getData();

            function getData() {
                dataService.getUsers().then(function (result) {
                    $scope.$watch('searchText', function (term) {
                        $scope.users = $filter('filter')(result, term);
                    });
                });
            }

            $scope.deleteUser = function (id) {
                dataService.deleteUser(id).then(function () {
                    toastr.success('User deleted successfully');
                    $('#exampleModal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    setTimeout($rootScope.logOut(), 1000);
                }, function () {
                    toastr.error('Error in deleting user with Id: ' + id);
                });
            };

            $scope.sortBy = function (column) {
                $scope.sortColumn = column;
                $scope.reverse = !$scope.reverse;
            }

        }])
        .controller('userAddCtrl', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
            $scope.createUser = function (user) {
                dataService.addUser(user).then(function () {
                    toastr.success('User create successfully');
                    $location.path('/');
                }, function () {
                    toastr.error('Error in creating user');
                });
            };
        }])
        .controller('userEditCtrl', ['$scope','$rootScope' ,'$routeParams', '$location', 'dataService', function ($scope, $rootScope, $routeParams, $location, dataService) {

            console.log('Inside of user edit.');

            $scope.updateUser = function (user) {
                console.log('Attempting to update user.');

                dataService.editUser(user).then(function () {
                    toastr.success('User updated successfully.');
                    console.log('User updated successfully.');
                    $rootScope.goAccount();
                }, function () {
                        toastr.error('Error in updating user.');
                        console.log('Error in updating user.');
                })
            };

        }])
        .controller('tournamentEditCtrl', ['$scope', '$routeParams', '$rootScope', '$location', 'dataService', function ($scope, $routeParams, $rootScope, $location, dataService) {
            console.log($routeParams.name);

            $scope.tournament = null;

            $scope.getTournament = function (user) {
                dataService.getTournament($routeParams.name, $rootScope.username).then(function (result) {
                    console.log("Tournament Fetch Success!");
                    console.log(result);
                    $scope.tournament = result;
                }, function () {
                    console.log("Tournament Fetch Failure!");
                })
            };

            $scope.getTournament();

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
