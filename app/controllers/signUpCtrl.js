(function () {
    'use strict';

    angular
        .module('app')
        .controller('signUpCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {
            console.log("At the signup screen");

            // debug function used to print out user info
            $scope.viewUser = function (user) {
                console.log(user.Email);
                console.log(user.Password);
            }

            // function used to sign up user
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
        }])
})();