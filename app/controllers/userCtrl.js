(function () {
    'use strict';

    angular
        .module('app')
        .controller('userCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {
            // used to get users
            $scope.users = [];

            function getData() {
                dataService.getUsers().then(function (result) {
                    $scope.$watch('searchText', function (term) {
                        $scope.users = $filter('filter')(result, term);
                    });
                });
            }

            // function used to delete a user
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

            // function used to handle the sorting of users
            $scope.sortBy = function (column) {
                $scope.sortColumn = column;
                $scope.reverse = !$scope.reverse;
            }
        }])
})();