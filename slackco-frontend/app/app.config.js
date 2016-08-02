'use strict';

angular
    .module('app.config', [])
    .factory('httpInterceptor', ['$q','$location', '$rootScope', 'localStorageService', httpInterceptor])
    .config(configs)
    .run(runs);

function httpInterceptor($q, $location, $rootScope, localStorageService){
    var responseError = function (rejection) {
        if (rejection.status === 401) {
            console.log('You are unauthorised to access the requested resource (401)');
        } else if (rejection.status === 404) {
            console.log('The requested resource could not be found (404)');
        } else if (rejection.status === 500) {
            console.log('Internal server error (500)');
            // $location.path('/');
        } else if (rejection.status === 403) {
            console.log('Signature has expired. (403)');
            $rootScope.isAuthorized = false;
            $rootScope.globals = {};
            localStorageService.remove('globals');
            // $http.defaults.headers.common.Authorization = 'Basic';
            $location.path('/');
        }
        return $q.reject(rejection);
    };

    return {
        responseError: responseError
    };
}

function configs($httpProvider, $resourceProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
    $resourceProvider.defaults.stripTrailingSlashes = false;
}

function runs($rootScope, $location, $http, localStorageService) {
    // keep user logged in after page refresh
    $rootScope.globals = localStorageService.get('globals') || {};
    $rootScope.isAuthorized = false;
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'JWT ' + $rootScope.globals.currentUser.token; // jshint ignore:line
        $rootScope.isAuthorized = true;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/', '/companies']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/');
        }
    });
}