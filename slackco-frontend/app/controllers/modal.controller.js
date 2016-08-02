'use strict';

angular
    .module('app')
    .controller('SigninModalCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'UserStorage', 'Auth', 
            function($scope, $uibModalInstance, $uibModal, UserStorage, Auth) {
        $scope.signinCompanyName = '';
        $scope.signupCompanyName = '';

        $scope.signinNext = function () {
            if ($scope.signInForm.$valid) {
                UserStorage.setCompany($scope.signinCompanyName);                
                $uibModalInstance.close();
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/signin-email.modal.tpl.html',
                    controller: 'SigninEmailModalCtrl',
                    windowClass: 'vcenter-modal'
                });
                modalInstance.result.then(
                    function(data) {

                    },
                    function() {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );    
            }    		
    	};

    	$scope.signupNext = function () {
            if ($scope.signUpForm.$valid) {
                UserStorage.setCompany($scope.signupCompanyName);
                $uibModalInstance.close();
    			var modalInstance = $uibModal.open({
        			animation: true,
        			templateUrl: 'views/modal/register-company.modal.tpl.html',
        			controller: 'RegisterCompanyModalCtrl',
        			windowClass: 'vcenter-modal'
        		});
        		modalInstance.result.then(
        			function(data) {

        			},
        			function() {
        				console.info('Modal dismissed at: ' + new Date());
        			}
    			);
            }
    	};

    	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
    .controller('SigninEmailModalCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'UserStorage', 'Auth', 
            function($scope, $uibModalInstance, $uibModal, UserStorage, Auth) {
        $scope.companyName = UserStorage.getCompany();
        $scope.email = '';

    	$scope.back = function () {
			$uibModalInstance.close();
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

    	$scope.continue = function () {
            if($scope.signInForm.$valid) {
                UserStorage.setEmail($scope.email);
                $uibModalInstance.close();
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/signin-pwd.modal.tpl.html',
                    controller: 'SigninPwdModalCtrl',
                    windowClass: 'vcenter-modal'
                });
                modalInstance.result.then(
                    function(data) {
                    },
                    function() {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            }    		
    	};

    	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
    .controller('SigninPwdModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', '$uibModal', '$location', 'localStorageService', 'UserStorage', 'Auth', 'Profile', 
            function($scope, $rootScope, $uibModalInstance, $uibModal, $location, localStorageService, UserStorage, Auth, Profile) {
        $scope.pwd = '';

    	$scope.back = function () {
			$uibModalInstance.close();
			var modalInstance = $uibModal.open({
    			animation: true,
    			templateUrl: 'views/modal/signin-email.modal.tpl.html',
    			controller: 'SigninEmailModalCtrl',
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

    	$scope.signinWithDiff = function () {
            /*
            $uibModalInstance.close();
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/signin-email.modal.tpl.html',
                controller: 'SigninEmailModalCtrl',
                windowClass: 'vcenter-modal'
            });
            modalInstance.result.then(
                function(data) {
                },
                function() {
                    console.info('Modal dismissed at: ' + new Date());
                }
            );*/
            Auth
                .sendMagic(UserStorage.getCompany(), UserStorage.getEmail())
                .then(success, error);

            function success(response) {
                $uibModalInstance.close();
                console.log(response);
            }

            function error(response) {
                console.log(response);
            }

    	};

    	$scope.signin = function () {
            if ($scope.signInForm.$valid) {
                Auth
                    .signin(UserStorage.getCompany(), UserStorage.getEmail(), $scope.pwd)
                    .then(success, error);
            }

            function success(response) {
                $uibModalInstance.close();
                Auth.setCredentials(UserStorage.getCompany(), UserStorage.getEmail(), response.token);

                Profile
                    .getProfile()
                    .then(success, error);

                function success(response) {
                    $rootScope.isAuthorized = true;
                    $rootScope.globals.currentUser.profile = response;
                    localStorageService.set('globals', $rootScope.globals);
                    $location.path('/home');
                }

                function error(response) {

                }                
            }

            function error(response) {
                console.log(response);
            }
    	};

    	$scope.forgotPwd = function () {
    		$uibModalInstance.close();
			var modalInstance = $uibModal.open({
    			animation: true,
    			templateUrl: 'views/modal/reset-pwd.modal.tpl.html',
    			controller: 'ResetPwdModalCtrl',
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

    	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
    .controller('ResetPwdModalCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'UserStorage', 'Auth', 
            function($scope, $uibModalInstance, $uibModal, UserStorage, Auth) {
        $scope.email = '';

        $scope.back = function () {
			$uibModalInstance.close();
			var modalInstance = $uibModal.open({
    			animation: true,
    			templateUrl: 'views/modal/signin-pwd.modal.tpl.html',
    			controller: 'SigninPwdModalCtrl',
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

    	$scope.resetPwd = function () {
            if ($scope.resetPwdForm.$valid) {
                Auth.
                    sendResetPwdRequest(UserStorage.getCompany(), $scope.email)
                    .then(success, error);

                function success(response) {
                    $uibModalInstance.close();
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modal/change-pwd.modal.tpl.html',
                        controller: 'ChangePwdModalCtrl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            key: function () {
                                return response.key;
                            }
                        }
                    });
                    modalInstance.result.then(
                        function(data) {
                        },
                        function() {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                }

                function error(response) {
                    console.log(response);
                }
            }			
    	};

    	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
    .controller('ChangePwdModalCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'UserStorage', 'Auth', 'key', 
            function($scope, $uibModalInstance, $uibModal, UserStorage, Auth, key) {
    	$scope.back = function () {
			$uibModalInstance.close();
			var modalInstance = $uibModal.open({
    			animation: true,
    			templateUrl: 'views/modal/reset-pwd.modal.tpl.html',
    			controller: 'ResetPwdModalCtrl',
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

    	$scope.changePwd = function () {
            if (($scope.changePwdForm.$valid) && ($scope.pwd === $scope.confirmPwd)) {
                Auth
                    .setNewPwd(key, $scope.pwd)
                    .then(success, error);

                function success(response) {
                    $uibModalInstance.close();
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modal/signin-pwd.modal.tpl.html',
                        controller: 'SigninPwdModalCtrl',
                        windowClass: 'vcenter-modal'
                    });
                    modalInstance.result.then(
                        function(data) {
                        },
                        function() {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                }

                function error(response) {
                    console.log(response);
                }
            }
    	};

    	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
    .controller('RegisterCompanyModalCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'UserStorage', 'Auth',  
            function($scope, $uibModalInstance, $uibModal, UserStorage, Auth) {
        $scope.email = '';

    	$scope.back = function () {
			$uibModalInstance.close();
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

    	$scope.continue = function () {
            if ($scope.registerForm.$valid) {
                UserStorage.setEmail($scope.email);
                $uibModalInstance.close();
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/register-pwd.modal.tpl.html',
                    controller: 'RegisterPwdModalCtrl',
                    windowClass: 'vcenter-modal'
                });
                modalInstance.result.then(
                    function(data) {
                    },
                    function() {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            }			
    	};

    	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
    .controller('RegisterPwdModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', '$uibModal', '$location', 'UserStorage', 'Auth',
            function($scope, $rootScope, $uibModalInstance, $uibModal, $location, UserStorage, Auth) {
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.pwd = '';
        $scope.confirmPwd = '';

    	$scope.back = function () {
			$uibModalInstance.close();
			var modalInstance = $uibModal.open({
    			animation: true,
    			templateUrl: 'views/modal/register-company.modal.tpl.html',
    			controller: 'RegisterCompanyModalCtrl',
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

    	$scope.createCompany = function () {			
            if (($scope.registerForm.$valid) && ($scope.pwd === $scope.confirmPwd)) {
                Auth
                    .signup(UserStorage.getCompany(), UserStorage.getEmail(), $scope.pwd)
                    .then(success, error);
            }

            function success(response) {                                
                $location.path('/home');
            }

            function error(response) {
                console.log(response);
            }
    	};

    	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])
    .controller('EditFriendsModalCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'UserStorage', 'Auth', 'Company', 'Common', 'friends', 
            function($scope, $uibModalInstance, $uibModal, UserStorage, Auth, Company, Common, friends) {
        $scope.isSearchDropdownOpened = false;
        $scope.allFiltered = true;
        $scope.companyFriends = [];
        $scope.industryList = [];
        $scope.filters = [];

        $scope.getIndustryList = getIndustryList;        
        $scope.filter = filter;
        $scope.selectItem = selectItem;
        $scope.selectAllItem = selectAllItem;
        $scope.applyFilter = applyFilter;
        //$scope.resetFilter = resetFilter;
        $scope.deleteFilter = deleteFilter;
        $scope.deleteAllFilters = deleteAllFilters;
        $scope.toggleSearchDropdown = toggleSearchDropdown;
        $scope.cancel = cancel;

        init();

        function init() {
            $scope.companyFriends = friends;
            console.log('friends:', friends);
            getIndustryList();
        }

        function getIndustryList() {
            Common
                .getIndustryList()
                .then(function(response) {                
                    console.log('Industry List:', response);
                    $scope.industryList = response;

                    angular.forEach($scope.industryList, function(item) {
                        angular.extend(item, {
                            filtered: true
                        });
                    });
                });
        }

        function filter() {
            $scope.companyFriends = friends.filter(function(friend) {
                var filtered = true;
                if(!$scope.allFiltered) {
                    for(var i=0; i<$scope.filters.length; i++) {
                        filtered = filtered && (friend.target_company.industry == $scope.filters[i].name);
                    }    
                }
                return filtered;
            }); 
        }

        function selectItem(item) {
            if($scope.allFiltered) {
                $scope.allFiltered = false;
                angular.forEach($scope.industryList, function(item) {
                    item.filtered = false;
                });
                item.filtered = true;
                return;
            }
            item.filtered = !item.filtered;
        }

        function selectAllItem() {
            if(!$scope.allFiltered) {
                $scope.allFiltered = true;
                angular.forEach($scope.industryList, function(item) {
                    item.filtered = true;                
                });              
            }           
        }

        function applyFilter() {
            $scope.filters = [];
            angular.forEach($scope.industryList, function(item) {
                if (item.filtered) {
                    $scope.filters.push(item);                    
                }
            });
            $scope.isSearchDropdownOpened = false;
            filter();
        }

        /*
        function resetFilter() {
            $scope.allFiltered = false;
            angular.forEach($scope.industryList, function(item) {
                item.filtered = false;
            });  
        }*/

        function deleteFilter(item) {
            for (var i=0; i<$scope.filters.length; i++) {
                if (item.id === $scope.filters[i].id) {
                    $scope.filters.splice(i, 1);
                }
            }

            angular.forEach($scope.industryList, function(itm) {
                if (item.id === itm.id) {
                    itm.filtered = false;
                }
            });
        }

        function deleteAllFilters() {
            $scope.filters = [];
            $scope.allFiltered = false;

            angular.forEach($scope.industryList, function(itm) {
                itm.filtered = false;
            });
        }
        
        function toggleSearchDropdown() {
            $scope.isSearchDropdownOpened = !$scope.isSearchDropdownOpened;
        }        

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }])
    .controller('CreateConvModalCtrl', ['$scope', '$http', 'config', '$uibModalInstance', '$uibModal', 
            function($scope, $http, config, $uibModalInstance, $uibModal) {        
        $scope.subject = "";
        $scope.description = "";
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.createConversation = function () {
            $uibModalInstance.dismiss('ok');
            var currentURI = window.location.href.toString().split(window.location.host)[1];
            var uriCompnents = currentURI.split('/');
            var companyID = uriCompnents[uriCompnents.length - 1];

            if (Number.isInteger(parseInt(companyID))) {

                console.log("Send", companyID);
                var request = {
                    target_id  : companyID, 
                    subject  : $scope.subject, 
                    description  : $scope.description, 
                };

                $http.post(config.baseURL + '/api/conversation/new_room/', request).then(function(response) {
                    console.log("creating conversation: ", response.data);
                    if (response.data.status == "Success") {
                        alert("Conversation request successfully sent");
                    } else {
                        alert("Conversation request failed");
                    }
                }); 
            } else {
                alert("Please select company");
            }
            

        };
    }]);