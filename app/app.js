(function () {
    'use strict';

    angular.module('app', [
        'ngRoute',
        'ui.bootstrap',
        'ngCookies',
    ])
        .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('');

            // configure all the routes
            $routeProvider
                .when('/', {
                    controller: 'welcomeCtrl',
                    templateUrl: '/app/templates/welcome.html'
                })
                .when('/login', {
                    controller: 'loginCtrl',
                    templateUrl: '/app/templates/login.html'
                })
                .when('/signup', {
                    controller: 'signUpCtrl',
                    templateUrl: '/app/templates/signUp.html'
                })
                .when('/dashboard', {
                    controller: 'dashboardCtrl',
                    templateUrl: '/app/templates/dashboard.html'
                })
                .when('/account', {
                    controller: 'accountCtrl',
                    templateUrl: '/app/templates/account.html'
                })
                .when('/jointournament', {
                    controller: 'joinTournamentCtrl',
                    templateUrl: '/app/templates/joinTournament.html'
                })
                .when('/addtournament', {
                    controller: 'addTournamentCtrl',
                    templateUrl: '/app/templates/addTournament.html'
                })
                .when('/adduser', {
                    controller: 'userAddCtrl',
                    templateUrl: '/app/templates/userAdd.html'
                })
                .when('/edituser', {
                    controller: 'userEditCtrl',
                    templateUrl: '/app/templates/userEdit.html'
                })
                .when('/tournamentedit/:name', {
                    controller: 'tournamentEditCtrl',
                    templateUrl: '/app/templates/tournamentEdit.html'
                })
                .otherwise({ redirectTo: '/' });

            $locationProvider.html5Mode(true);
        }])
        .run(function ($rootScope, $cookies, $location) {

            // if the user is signed in
            $rootScope.signedIn = false;
            $rootScope.username = null;
            $rootScope.password = null;

            console.log($cookies.get('username'));
            console.log($cookies.get('password'));

            $rootScope.getCookies = function () {
                if ($cookies.get('username') != null && $cookies.get('password') != null) {
                    $rootScope.username = $cookies.get('username');
                    $rootScope.password = $cookies.get('password')
                    $rootScope.signedIn = true;
                }
            }

            $rootScope.goHome = function () {
                $location.path('/');
            }

            $rootScope.goAccount = function () {
                $location.path('/account');
            }

            $rootScope.goHome();

            $rootScope.storeUserCookie = function () {
                $cookies.put('username', $rootScope.username);
                $cookies.put('password', $rootScope.password);
            }

            $rootScope.removeUserCookie = function () {
                $cookies.remove('username');
                $cookies.remove('password');
            }

            $rootScope.getCookies();

            $rootScope.logOut = function () {
                console.log('Signing out');
                toastr.info('User logged out: ' + $rootScope.username + '.');
                $rootScope.username = null;
                $rootScope.password = null;
                $rootScope.signedIn = false;
                $rootScope.removeUserCookie();
                $rootScope.goHome();
            };

            $rootScope.$on("$routeChangeStart", function (event, next, current) {

                console.log(next.templateUrl);

                if ($rootScope.username == null &&
                    (next.templateUrl != "/app/templates/welcome.html"
                      && next.templateUrl != "/app/templates/signUp.html")) {
                    // no logged user, we should be going to #login
                    if (next.templateUrl == "/app/templates/login.html") {
                        return;
                    }
                    // not going to #login, we should redirect now
                    $location.path("/login");
                }
            })

        });

})();
