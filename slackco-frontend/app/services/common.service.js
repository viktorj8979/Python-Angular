(function(){
'use strict';

angular
    .module('app')
    .factory('Common', CommonService);
    
    CommonService.$inject = ['$http', '$rootScope', '$timeout', 'config'];

    function CommonService($http, $rootScope, $timeout, config) {
        var service = {};

        service.getIndustryList = getIndustryList;
        service.getDepartList = getDepartList;
        service.getCompanySizeList = getCompanySizeList;
        service.getCountryList = getCountryList;
        service.getStateList = getStateList;

        /**
         * @name getIndustryList
         * @desc get company list
         */
        function getIndustryList() {
            return $http.get(config.baseURL + '/api/company/industry/list/').then(function(response) {
                var list = [];
                angular.forEach(response.data, function(item) {
                    list.push({name: item});
                });
                return list;
            });
        }

        function getDepartList() {
            return $http.get(config.baseURL + '/api/company/department/list/').then(function(response) {
                var list = [];
                angular.forEach(response.data, function(item) {
                    list.push({name: item});
                });
                return list;
            });
        }

        function getCompanySizeList() {
            var list = [
                {
                    id: 1,
                    name: '1-10 employees'
                },
                {
                    id: 2,
                    name: '11-50 employees'
                },
                {
                    id: 3,
                    name: '51-100 employees'
                },
                {
                    id: 4,
                    name: '101-200 employees'
                },
                {
                    id: 5,
                    name: '201-500 employees'
                },
                {
                    id: 6,
                    name: '501-1000 employees'
                },
            ];
            return list;
        }

        function getCountryList() {
            var list = [
                {
                    id: 1,
                    name: 'Netherlands'
                },
                {
                    id: 2,
                    name: 'United States'
                },
                {
                    id: 3,
                    name: 'Sweden'
                }
            ];
            return list;
        }          

        function getStateList() {
            var list = [
                {
                    id: 1,
                    name: 'Alabama'
                },
                {
                    id: 2,
                    name: 'Alaska'
                },
                {
                    id: 3,
                    name: 'Austin'
                },
                {
                    id: 4,
                    name: 'Arlington'
                },
                {
                    id: 5,
                    name: 'Tampa'
                },
                {
                    id: 6,
                    name: 'Aurora'
                }
            ];
            return list;
        }  
        
        return service;
    }
    
})();