'use strict';

angular
    .module('app.routes', ['ngRoute'])
    .config(config);

function config ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'views/index/index.tpl.html',
            controller: 'IndexController'
        })
        .when('/home', {
            templateUrl: 'views/home/home.tpl.html',
            controller: 'HomeController'
        })
        .when('/companies', {
            templateUrl: 'views/companies/index.tpl.html',
            controller: 'CompanyController'
        })
        .when('/conversations', {
            templateUrl: 'views/conversation/index.tpl.html',
            controller: 'ConvController'
        })
        .when('/manage-conversation', {
            templateUrl: 'views/conversation/conv-mng.tpl.html',
            controller: 'ConvMngController'
        })
        .when('/company-profile/:id', {
            templateUrl: 'views/companies/company-profile.tpl.html',
            controller: 'CompanyProfileController'
        })
        .when('/settings', {
            templateUrl: 'views/settings/index.tpl.html',
            controller: 'SettingsController'
        })
        .otherwise({
            redirectTo: '/'
        });

    // use the HTML5 History API
    // $locationProvider.html5Mode(true);
}