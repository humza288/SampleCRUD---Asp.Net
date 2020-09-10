(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginCtrl', ['$scope', '$rootScope', '$filter', '$location', 'dataService',
            function ($scope, $rootScope, $filter, $location, dataService) {
                console.log("At the login screen");

                // function used to handle user login
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
            }]
        )
})();