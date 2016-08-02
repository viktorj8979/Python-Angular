'use strict';

angular
    .module('app')
    .controller('ConvController', ['$scope', '$http', 'config', '$rootScope', '$filter', '$uibModal', 'UserStorage', '$location', 
            function($scope, $http, config, $rootScope, $filter, $uibModal, UserStorage, $location) {
        $rootScope.hasMenuBG = true;
        $rootScope.hasFooter = false;
        $scope.rooms = [];
        $scope.currentRoom = [];
        $scope.selection = 'list';
        // var host = 'slackco.herokuapp.com';
        var host = '127.0.0.1:8000';
        console.log("entered ConvController");
        var currentUserInfo = JSON.parse(localStorage['ls.globals']);
        var user_id = currentUserInfo.currentUser.profile.user_id;

        var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
        $scope.chatsock = null;

        $http.get(config.baseURL + '/api/v1/rooms/').then(function(response) {
            $scope.rooms = response.data.results;
        });
        // API Test
        // $http.get(config.baseURL + '/api/company/affiliated/list/').then(function(response) {
        //     console.log(response.data);
        // });

        // $http.post(config.baseURL + '/api/company/member/invite/', {
        //     email: "user" + Math.floor(Math.random() * 1000) + "@mail.com",
        //     department: "Development"
        // }).then(function(response) {
        //     console.log(response.data);
        // });
        // End of API Test

        $scope.gotoManage = function() {
            $rootScope.currentRoom = $scope.currentRoom;
            localStorage.currentRoomID = $scope.currentRoom.id;
            $location.path('manage-conversation');
        }

        $scope.enterRoom = function(roomID) {
            // body.../api/company/friend/list/
            $scope.selection = 'detail';
            console.log("user_id: ", user_id);
            $scope.currentRoom = $filter('filter')($scope.rooms, { id: roomID })[0];
            var host = '127.0.0.1:8000';
            $scope.chatsock = new ReconnectingWebSocket(ws_scheme + '://' + host + "/chat/" + roomID);
            $scope.chatsock.onmessage = function(message) {
                var data = JSON.parse(message.data);
                console.log("data: ", data)
                var chat = $("#chat")
                var ele = $('<li class="wrapper"><div class="conv-wrapper gray-bg"></div></li>')

                ele.append(
                    $("<p class=chat-time></p>").text($scope.getFormattedTime(data.timestamp))
                )
                ele.append(
                    $("<h3 class=user-name></h3>").text(data.handle.first_name + " " + data.handle.last_name)
                )
                if (data.type == 'file') {
                    var fileUrl = data.message;
                    var fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
                    console.log('file uploaded');
                    ele.append(
                        $("<p class=chat-data></p>").html("<a href=" + fileUrl + " target=_blank>" + fileName + "</a>")
                    )
                } else {
                    console.log("data-type: ", data.type)
                    ele.append(
                        $("<p class=chat-data></p>").text(data.message)
                    )
                }
                chat.append(ele)
            };
        }

        $scope.getFileName = function(fileUrl){
            var fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            return fileName;
        }

        $scope.getFormattedTime = function(datetime_input){
            var datetime = moment(datetime_input, "YYYYMMDD h:m:s").fromNow();
            return datetime;
        }

        $scope.send = function() {
            var message = {
                handle: user_id,
                type: "text",
                message: $('#message').val(),
            }
            $scope.chatsock.send(JSON.stringify(message));
            $("#message").val('').focus();
            return false;
        }

        $scope.checkFile = function() {
            var fileName = $("#file").val();
            if (fileName) {
                console.log("file is selected");
                // Added code
                var fd = new FormData();
                var files = $('#file').prop("files");
                if (files.length) {
                    fd.append("file", files[0], files[0].name);
                }
                $http({
                    method: 'POST',
                    dataType: 'jsonp',
                    url: config.baseURL + '/api/v1/files/',
                    data: fd,
                    processData: false,
                    crossDomain: true,
                    headers: {
                        'Content-Type': undefined
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    transformRequest: angular.identity
                }).success(function(data, status, headers, cfg) {
                    console.log("response: ", data);
                        var message = {
                            handle: user_id,
                            type: "file",
                            message: data.file,
                        }
                        $scope.chatsock.send(JSON.stringify(message));
                        $("#message").val('').focus();
                        $("#file").val('');
                        return false;
                }).error(function(data, status, headers, cfg) {
                    alert("file upload failed");
                });
                // End of code

            } else {
                console.log("not selected");
            }
        }

    }])
    .controller('ConvMngController', ['$scope', '$http', 'config', '$rootScope', '$uibModal', 
            function($scope, $http, config, $rootScope, $uibModal) {
        $rootScope.hasMenuBG = true;
        $rootScope.hasFooter = false;
        $scope.members = [];
        $scope.currentRoom = $rootScope.currentRoom;
        var currentRoomID = localStorage.currentRoomID;
        $http.get(config.baseURL + '/api/v1/rooms/' + currentRoomID + '/').then(function(response) {
            $scope.currentRoom = response.data.results;
            var currentRoom = response.data.results;
            if (response.data !== undefined) {
                $http.get(config.baseURL + '/api/v1/members/').then(function(resp) {
                    $scope.members = resp.data.results;
                    for (var i = 0; i < $scope.members.length; i++) {
                        $scope.members[i].selected = false;
                        for (var j = 0; j < response.data.members.length; j++) {
                            if (response.data.members[j].id == $scope.members[i].user_id) {
                                $scope.members[i].selected = true;
                            }
                        }
                    }
                });
            }
        });
        $scope.toggleSelect = function(member_index) {
            $scope.members[member_index].selected = !($scope.members[member_index].selected);
        }
        $scope.saveSettings = function() {
            var members = [];
            for (var i = 0; i < $scope.members.length; i++) {
                if ($scope.members[i].selected) {
                    members.push($scope.members[i].user_id);
                }
            }
            var request = { room_id: currentRoomID, members_id: members }
            $http.post(config.baseURL + '/api/conversation/add_member/', request).then(function(resp) {
                console.log(resp.data);
            });
        }
    }]);
