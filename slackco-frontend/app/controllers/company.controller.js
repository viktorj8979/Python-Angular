'use strict';

angular
    .module('app')
    .controller('CompanyController', ['$scope', '$rootScope', '$timeout', '$location', 'Company', 'Common', 
            function($scope, $rootScope, $timeout, $location, Company, Common) {
    	$rootScope.hasMenuBG = true;

    	$scope.isSearchDropdownOpened = false;
        $scope.isOnMap = true;
        $scope.allFiltered = true;
        $scope.companyList = [];
        $scope.filters = [];
        $scope.companyProfile = {};
        $scope.searchKey = '';

        $scope.getIndustryList = getIndustryList;
        $scope.getCompanyList = getCompanyList;
        $scope.getCompanyProfile = getCompanyProfile;
        $scope.selectItem = selectItem;
        $scope.selectAllItem = selectAllItem;
        $scope.applyFilter = applyFilter;
        //$scope.resetFilter = resetFilter;
        $scope.deleteFilter = deleteFilter;
        $scope.deleteAllFilters = deleteAllFilters;
        $scope.toggleSearchDropdown = toggleSearchDropdown;
        $scope.toggleOnMap = toggleOnMap;
        $scope.filter = filter;
        $scope.inviteFriend = inviteFriend;
        $scope.visitCompany = visitCompany;

        init();

        function init() {
            getCompanyProfile();
            getIndustryList();            

            var cities = [{
                city: 'Toronto',
                desc: 'This is the best city in the world!',
                lat: 43.7000,
                long: -79.4000
            }, {
                city: 'New York',
                desc: 'This city is aiiiiite!',
                lat: 40.6700,
                long: -73.9400
            }, {
                city: 'Chicago',
                desc: 'This is the second best city in the world!',
                lat: 41.8819,
                long: -87.6278
            }, {
                city: 'Los Angeles',
                desc: 'This city is live!',
                lat: 34.0500,
                long: -118.2500
            }, {
                city: 'Las Vegas',
                desc: 'Sin City...\'nuff said!',
                lat: 36.0800,
                long: -115.1522
            }];

            var mapOptions = {
                zoom: 4,
                center: new google.maps.LatLng(40.0000, -98.0000),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };        

            $timeout(function() {
                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

                $scope.markers = [];

                var infoWindow = new google.maps.InfoWindow();

                var createMarker = function(info) {

                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: new google.maps.LatLng(info.lat, info.long),
                        title: info.city
                    });
                    marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

                    google.maps.event.addListener(marker, 'click', function() {
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open($scope.map, marker);
                    });

                    $scope.markers.push(marker);
                }

                for (var i = 0; i < cities.length; i++) {
                    createMarker(cities[i]);
                }

                $scope.openInfoWindow = function(e, selectedMarker) {
                    e.preventDefault();
                    google.maps.event.trigger(selectedMarker, 'click');
                };
            }, 500);
        }

        function getCompanyProfile() {
            Company
                .getCompanyProfile()
                .then(function(response) {
                    console.log('Company profile:', response);
                    $scope.companyProfile = response;
                    getCompanyList();                  
                });
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

        function getCompanyList() {
            Company
                .getCompanyList()
                .then(function(response) {
                    console.log('company list:', response.results);
                    $scope.companyList = response.results;
                    filter();                   
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

        function toggleSearchDropdown(toggle) {
            if(toggle) {
                $scope.isSearchDropdownOpened = toggle;
                return;
            }
            $scope.isSearchDropdownOpened = !$scope.isSearchDropdownOpened;
        }

        function toggleOnMap() {
            $scope.isOnMap = !$scope.isOnMap;
        }

        function filter() {
            $scope.filteredCompanyList = $scope.companyList.filter(function(company) {
                var filtered = true;
                filtered = (company.id!=$scope.companyProfile.id);
                filtered = filtered && (company.name.indexOf($scope.searchKey)!=-1) || (company.website && company.website==$scope.searchKey) || (company.owner.email && company.owner.email==$scope.searchKey);
                if(!$scope.allFiltered) {
                    for(var i=0; i<$scope.filters.length; i++) {
                        filtered = filtered && (company.industry == $scope.filters[i].name);
                    }    
                }
                return filtered;
            }); 
        }

        function inviteFriend(id, $event) {
            $event.stopPropagation();
            /*
            Company
                .inviteFriend(id)
                .then(function(response) {
                    console.log('Invite frined:', response);
                });
                */
        }

        function visitCompany(id) {
            $location.path('/company-profile/' + id);
        }        
    }])
    .controller('CompanyProfileController', ['$scope', '$rootScope', '$uibModal', '$route', 'Company', 
            function($scope, $rootScope, $uibModal, $route, Company) {
        $rootScope.hasMenuBG = false;

        $scope.companyProfile = {};
        $scope.companyList = [];
        $scope.companyFriends = [];
        $scope.companyMembers = [];
        $scope.affiCompanies = [];

        $scope.getCompanyList = getCompanyList;
        $scope.getCompanyDetail = getCompanyDetail;
        $scope.getCompanyFriends = getCompanyFriends;
        $scope.sendFriendRequest = sendFriendRequest;
        $scope.createConv = createConv;

        init();

        function init() {
            getCompanyList();
            getCompanyDetail();
            getCompanyFriends();
            getCompanyMembers();
        }

        function getCompanyList() {
            Company
            .getCompanyList()
            .then(function(response) {      
                console.log("Company List:", response.results);          
                $scope.companyList = response.results;                
            });    
        }

        function getCompanyDetail() {
            Company
                .getCompanyDetail($route.current.params.id)
                .then(function(response) {
                    console.log('Company profile:', response);                
                    $scope.companyProfile = response;
                    $scope.affiCompanies = $scope.companyProfile.affiliated_companies.filter(function(company) {                                              
                        return company.id!=$scope.companyProfile.id;
                    }); 
                });    
        }

        function getCompanyFriends() {
            Company
                .getCompanyFriendsWithId($route.current.params.id)
                .then(function(response) {                
                    console.log('Company friends:', response);
                    $scope.companyFriends = response.results;                
                });
        }

        function getCompanyMembers() {
            Company
                .getCompanyMemberWithId($route.current.params.id)
                .then(function(response) {                
                    console.log('Company members:', response);
                    $scope.companyMembers = response.results;                
                });    
        }

        function sendFriendRequest() {
            Company
                .inviteFriend($route.current.params.id)
                .then(function(response) {
                    console.log('invite friend:', response);
                });  
        }
        
        function createConv() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/create-conv.modal.tpl.html',
                controller: 'CreateConvModalCtrl',
                windowClass: 'vcenter-modal auto-height'
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