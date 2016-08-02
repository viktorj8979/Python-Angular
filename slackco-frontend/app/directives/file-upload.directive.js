'use strict';

angular
    .module('app')
    .directive('fileUpload', function () {
        return {
            scope: true,        //create a new scope
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var files = event.target.files;
                    scope.$emit("fileSelected", {key: attrs.profileAttr, file: files[0] });
                });
            }
        }
    });
