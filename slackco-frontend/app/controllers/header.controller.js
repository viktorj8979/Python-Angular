'use strict';
angular
    .module('app')
    .controller('HeaderController', ['$scope', '$rootScope', '$uibModal', '$location', 'Auth',
            function($scope, $rootScope, $uibModal, $location, Auth) {
        $scope.signin = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/signin.modal.tpl.html',
                controller: 'SigninModalCtrl',
                windowClass: 'vcenter-modal'
            });
            modalInstance.result.then(
                function(data) {

                },
                function() {
                    console.info('Modal dismissed at: ' + new Date());
                }
            );
        };

        $scope.signout = function () {
            $rootScope.isAuthorized = false;
            Auth.clearCredentials();
            $location.path('/');
        }; 	
    }]);