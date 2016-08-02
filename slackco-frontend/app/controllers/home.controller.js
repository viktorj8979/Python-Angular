'use strict';

angular
    .module('app')
    .controller('HomeController', ['$scope', '$rootScope', '$uibModal', 'Company', 'config',
            function($scope, $rootScope, $uibModal, Company, config) {
    	$rootScope.hasMenuBG = false;

        $scope.companyProfile = {};
        $scope.companyFriends = [];
        $scope.companyMembers = [];
        $scope.affiCompanies = [];
        $scope.socials = [];
        $scope.owner = {};
        $scope.isActiveSocials = false;

        $scope.getCompanyProfile = getCompanyProfile;
        $scope.getCompanyFriends = getCompanyFriends;
        $scope.getCompanyMembers = getCompanyMembers;
        $scope.changeLogo = changeLogo;
        $scope.changeCover = changeCover;
        $scope.editFriends = editFriends;
        
        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                var formData = new FormData();
                formData.append(args.key, args.file);
                angular.forEach($scope.companyProfile, function(value, key) {
                    if(args.key == 'logo' && key != 'cover')
                        formData.append(key, value);
                    if(args.key == 'cover' && key != 'logo')
                        formData.append(key, value);
                });
                Company
                    .updateUploadedFile(formData)
                    .then(function(response) {
                        $scope.companyProfile = response;                        
                        console.log('updated company profile:', response);
                    });
            });
        });

        init();

        function init() {
            getCompanyProfile();            
        }

        function getCompanyProfile() {
            Company
                .getCompanyProfile()
                .then(function(response) {
                    console.log('Company profile:', response);
                    $scope.companyProfile = response;

                    $scope.affiCompanies = $scope.companyProfile.affiliated_companies.filter(function(company) {                                              
                        return company.id!=$scope.companyProfile.id;
                    }); 

                    for(var i=0; i<config.socials.length; i++) {
                        var key = config.socials[i];
                        $scope.isActiveSocials = $scope.isActiveSocials || ($scope.companyProfile[key]) && ($scope.companyProfile[key] != '');    
                    }

                    getCompanyFriends();
                    getCompanyMembers();                  
                });    
        }

        function getCompanyFriends() {
            Company
                .getCompanyFriends()
                .then(function(response) {
                    $scope.companyFriends = response.results.filter(function(company) {
                        return (company.id != $scope.companyProfile.id);
                    });                
                    console.log('Company friends:', $scope.companyFriends);
                });
        } 

        function getCompanyMembers() {
            Company
                .getCompanyMemberWithId($scope.companyProfile.id)
                .then(function(response) {                
                    console.log('Company members:', response);
                    $scope.companyMembers = response.results;                
                });
        }

        function changeLogo() {
            $('#logoFile').click();
        }

        function changeCover() {
            $('#coverFile').click();   
        }

        function editFriends() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/edit-friends.modal.tpl.html',
                controller: 'EditFriendsModalCtrl',
                windowClass: 'vcenter-modal transparent-modal',
                backdrop: 'static',
                backdropClass: 'transparent-backdrop',
                resolve: {
                    friends: function () {
                      return $scope.companyFriends;
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

    	
    }]);