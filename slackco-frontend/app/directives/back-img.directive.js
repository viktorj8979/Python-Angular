'use strict';

angular
    .module('app')
    .directive('backImg', function () {
        return {
            scope: true,        //create a new scope
            link: function (scope, element, attrs) {
                scope.$watch(function() { return attrs.backImg; }, function () {
                    element.css({
                        'background-image': 'url(' + attrs.backImg +')',
                        'background-size' : 'cover'
                    });
                });                
            }
        }
    });