(function () {
    'use strict';

    angular
        .module('app')
        .controller('userAddCtrl', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
            // function used to create a user
            $scope.createUser = function (user) {
                dataService.addUser(user).then(function () {
                    toastr.success('User create successfully');
                    $location.path('/');
                }, function () {
                    toastr.error('Error in creating user');
                });
            };
        }])
})();