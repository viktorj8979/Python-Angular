'use strict';
angular
    .module('app')
    .controller('IndexController', ['$scope', '$rootScope', '$uibModal', 
            function($scope, $rootScope, $uibModal) {
        $rootScope.hasMenuBG = false;

    	$scope.getStarted = function() {
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
    }]);