(function () {
    'use strict';

    angular
        .module('app')
        .controller('welcomeCtrl', ['$scope', '$rootScope', '$filter', 'dataService', function ($scope, $rootScope, $filter, dataService) {
            console.log("At the welcome screen");

        }])
})();
