(function () {
    'use strict';

    angular
        .module('app')
        .controller('userEditCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'dataService', function ($scope, $rootScope, $routeParams, $location, dataService) {
            console.log('Inside of user edit.');

            // function used to edit a users data
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
})();