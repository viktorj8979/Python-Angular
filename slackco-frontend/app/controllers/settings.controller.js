'use strict';

angular
    .module('app')
    .controller('SettingsController', ['$scope', '$rootScope', '$uibModal', '$routeParams', 'localStorageService', 'Profile', 'Company', 'Common', 
            function($scope, $rootScope, $uibModal, $routeParams, localStorageService, Profile, Company, Common) {
    	$rootScope.hasMenuBG = true;

    	$scope.selMainTab = $routeParams.main ? $routeParams.main : 'personal';
    	$scope.selSubTab = $routeParams.sub ? $routeParams.sub : 'personal-profile';
    	$scope.isDepartDropdownOpened = false;
    	$scope.isComsizeDropdownOpened = false;
    	$scope.isCountryDropdownOpened = false;
    	$scope.isStateDropdownOpened = false;
        $scope.isIndustryDropdownOpened = false;
        $scope.oldPwd = '';
        $scope.newPwd = '';
        $scope.filteredDepart = 'All';
        $scope.newMember = {email: '', department: 'Web Developers'};
        $scope.companyList = [];
        $scope.industryList = [];
        $scope.departList = [];
        $scope.members = [];
        $scope.filterMembers = [];
        $scope.personalProfile = {};
        $scope.companyProfile = {};
        $scope.socialURL = {};
        $scope.socialURLAction = {};
        $scope.sizeList = Common.getCompanySizeList();
        $scope.countryList = Common.getCountryList();
        $scope.stateList = Common.getStateList();

        $scope.filterMember = filterMember;

        init();

        function init() {
            if ($scope.selMainTab === 'personal') {
                if ($scope.selSubTab === 'personal-profile') {                    
                    getProfile();
                    getDepartList();        
                }
            } else if ($scope.selMainTab == 'company') {
                getCompanyProfile();
                getIndustryList();                
                if ($scope.selSubTab == 'affiliate-companies') {
                    getCompanyList();
                }
            } else if ($scope.selMainTab == 'team') {
                if ($scope.selSubTab == 'account-mng') {
                    getCompanyProfile();                    
                    getDepartList();
                }
            }
        }

        function getProfile() {
            Profile
                .getProfile()
                .then(function(response) {                
                    $scope.personalProfile = response;                
                    console.log('Personal profile:', $scope.personalProfile);
                });
        }

        function getCompanyProfile() {
            Company
                .getCompanyProfile()
                .then(function(response) {                
                    $scope.companyProfile = response;
                    $scope.socialURL = response;
                    console.log('Company profile:', $scope.companyProfile);
                    getCompanyMembers();                
                });
        }     

        function getCompanyFriends() {
            Company
                .getCompanyFriends()
                .then(function(response) {                
                    console.log('Company friends:', response);                
                });
        }        

        function getCompanyList() {
            Company
                .getCompanyList()
                .then(function(response) {                
                    console.log('Company list:', response);
                    $scope.companyList = response.results;
                });
        }

        function getIndustryList() {
            Common
                .getIndustryList()
                .then(function(response) {                
                    console.log('industry list:', response);
                    $scope.industryList = response;
                });
        }          

        function getDepartList() {
            Common
                .getDepartList()
                .then(function(response) {                
                    console.log('depart list:', response);
                    $scope.departList = response;
                });
        }

        function getCompanyMembers() {
            Company
                .getCompanyMemberWithId($scope.companyProfile.id)
                .then(function(response) {                
                    console.log('Company members:', response);
                    $scope.members = response.results;
                    filterMember($scope.filteredDepart);
                });
        }

    	$scope.toggleDepartDropdown = function () {
    		$scope.isDepartDropdownOpened = !$scope.isDepartDropdownOpened;
    	};

        $scope.selectDepart = function (depart) {
            $scope.isDepartDropdownOpened = false;
            $scope.personalProfile.department = depart.name;            
        };

    	$scope.toggleSizeDropdown = function () {
    		$scope.isComsizeDropdownOpened = !$scope.isComsizeDropdownOpened;
    	};

        $scope.selectSize = function (size) {
            $scope.isComsizeDropdownOpened = false;
            $scope.companyProfile.company_size = size.name;
        };

    	$scope.toggleCountryDropdown = function (toggle) {
    		$scope.isCountryDropdownOpened = !$scope.isCountryDropdownOpened;
    	};

        $scope.selectCountry = function (country) {
            $scope.isCountryDropdownOpened = false;
            $scope.companyProfile.country = country.name;
        };

    	$scope.toggleStateDropdown = function (toggle) {
    		$scope.isStateDropdownOpened = !$scope.isStateDropdownOpened;
    	};

        $scope.selectState = function (state) {
            $scope.isStateDropdownOpened = false;
            $scope.companyProfile.state = state.name;
        };

        $scope.toggleIndustryDropdown = function (toggle) {
            $scope.isIndustryDropdownOpened = !$scope.isIndustryDropdownOpened;
        };

        $scope.selectIndustry = function (industry) {
            $scope.isIndustryDropdownOpened = false;
            $scope.companyProfile.industry = industry.name;
        };

        $scope.focusSocialURL = function (type) {            
            if ($scope.companyProfile[type] == null || $scope.companyProfile[type] == '') {
                $scope.socialURLAction[type] = 'create';
            } else {
                $scope.socialURLAction[type] = 'update';
            }
        };

        $scope.blurSocialURL = function (type) {
            $scope.socialURLAction[type] = '';            
        };        

        $scope.cancelSocialURL = function (type) {
            $scope.socialURLAction[type] = '';
            $scope.socialURL[type] = $scope.companyProfile[type];
        };

        $scope.saveSocialURL = function (type) {            
            if ($scope.socialForm.$valid && $scope.socialURL[type] != '' && $scope.socialURL[type] != null) {
                $scope.socialURLAction[type] = '';
                $scope.companyProfile[type] = $scope.socialURL[type];
                Company
                    .updateCompanyProfile($scope.companyProfile)
                    .then(function(response) {
                        console.log(response);
                    });    
            }            
        };

        $scope.isAffiliated = function (company) {
            for(var i=0; i<$scope.companyProfile.affiliated_companies.length; i++) {
                var affi_company = $scope.companyProfile.affiliated_companies[i];
                if(company.id == affi_company.id) {
                    return true;
                }
            }
            return false;
        };

        function filterMember(depart) {
            $scope.filteredDepart = depart;
            $scope.filteredMembers = $scope.members.filter(function(member) {
                var filtered = true;                
                if(depart != 'All') {
                    filtered = filtered && (member.department == depart);
                }
                return filtered;
            }); 
        }

        $scope.updateSettings = function (type) {
            if (type === 'personal') {
                if ($scope.selSubTab === 'personal-profile') {                    
                    if ($scope.profileForm.$valid) {
                        Profile
                            .saveProfile($scope.personalProfile)
                            .then(function(response) {
                                $rootScope.globals.currentUser.profile = response;
                                localStorageService.set('globals', $rootScope.globals);
                            }, function(response) {
                                console.log(response);
                            });
                    }
                } else if ($scope.selSubTab === 'personal-pwd') {
                    if ($scope.changePwdForm.$valid) {
                        Profile
                            .changePassword($scope.oldPwd, $scope.newPwd)
                            .then(function(response) {
                                console.log(response);
                            }, function(response) {
                                console.log(response);
                            });
                    }
                }
            } else if (type == 'company') {
                Company
                    .updateCompanyProfile($scope.companyProfile)
                    .then(function(response) {                
                        console.log(response);
                    });
                if ($scope.selSubTab == 'basic-info') {

                } else if ($scope.selSubTab == 'socials') {

                } else if ($scope.selSubTab == 'affiliate-companies') {

                }
            } else if (type == 'team') {
                if ($scope.selSubTab == 'account-mng') {
                    if ($scope.teamForm.$valid) {
                        Company
                            .inviteMember($scope.newMember)
                            .then(function(response) {                
                                console.log(response);
                            });
                    }
                }
            }
        };
    }]);