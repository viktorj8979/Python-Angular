(function(){
'use strict';

angular
	.module('app')
	.factory('Company', CompanyService);
	
	CompanyService.$inject = ['$http', '$rootScope', '$timeout', 'config'];

	function CompanyService($http, $rootScope, $timeout, config) {
		var service = {};

		service.getCompanyList = getCompanyList;
		service.getCompanyDetail = getCompanyDetail;
		service.getCompanyProfile = getCompanyProfile;
		service.updateCompanyProfile = updateCompanyProfile;
		service.updateUploadedFile = updateUploadedFile;
		service.createCompanyInfo = createCompanyInfo;
		service.getCompanyFriends = getCompanyFriends;
		service.getCompanyFriendsWithId = getCompanyFriendsWithId;
		service.createCompanyFriend = createCompanyFriend;
		service.deleteCompanyFriend = deleteCompanyFriend;
		service.getCompanyMembers = getCompanyMembers;
		service.getCompanyMemberWithId = getCompanyMemberWithId;
		service.inviteMember = inviteMember;
		service.confirmInviteMember = confirmInviteMember;
		service.inviteFriend = inviteFriend;
		service.confirmInviteFriend = confirmInviteFriend;
		service.createCompanyMember = createCompanyMember;
		service.updateCompanyMember = updateCompanyMember;
		service.deleteCompanyMember = deleteCompanyMember;
		service.getAffiliCompanies = getAffiliCompanies;

		/**
	 	 * @name getCompanyList
	 	 * @desc get company list
	 	 */
		function getCompanyList() {
			return $http.get(config.baseURL + '/api/company/list/').then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name getCompanyDetail
	 	 * @desc get company detail
	 	 * @param id: company id
	 	 */
		function getCompanyDetail(id) {
			return $http.get(config.baseURL + '/api/company/list/' + id + '/').then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name getCompanyProfile
	 	 * @desc get company profile
	 	 */
		function getCompanyProfile() {
			return $http.get(config.baseURL + '/api/company/profile/get/').then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name updateCompanyProfile
	 	 * @desc update company profile
	 	 */
		function updateCompanyProfile(data) {
			delete data['logo'];
			delete data['cover'];
			return $http.put(config.baseURL + '/api/company/profile/put/', data).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name updateUploadedFile
	 	 * @desc update company profile by uploading file
	 	 */
		function updateUploadedFile(data) {
			var request = {
                method: 'PUT',
                url: config.baseURL + '/api/company/profile/put/',
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };

			return $http(request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name createCompanyInfo
	 	 * @desc create company info
	 	 */
		function createCompanyInfo() {
			var request = {				
			};

			return $http.post(config.baseURL + '/api/company/info/', request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name getCompanyFriends
	 	 * @desc get company friends
	 	 */
		function getCompanyFriends() {
			return $http.get(config.baseURL + '/api/v1/friends/').then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name getCompanyFriendsWithId
	 	 * @desc get company friends with id
	 	 */
		function getCompanyFriendsWithId(id) {
			return $http.get(config.baseURL + '/api/v1/friends/?source_company=' + id).then(function(response) {
				return response.data;
			});				
		}		

		/**
	 	 * @name createCompanyFriend
	 	 * @desc create company friend
	 	 */
		function createCompanyFriend() {
			var request = {
				
			};

			return $http.post(config.baseURL + '/api/company/friends/', request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name deleteCompanyFriend
	 	 * @desc delete company friend
	 	 */
		function deleteCompanyFriend() {
			var request = {				
			};

			return $http.delete(config.baseURL + '/api/company/friends/', request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name getCompanyMembers
	 	 * @desc get company member
	 	 */
		function getCompanyMembers() {
			return $http.get(config.baseURL + '/api/v1/members/').then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name getCompanyMember
	 	 * @desc get company member with id
	 	 */
		function getCompanyMemberWithId(id) {
			return $http.get(config.baseURL + '/api/v1/members/?company=' + id).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name inviteMember
	 	 * @desc invite member via email
	 	 */
		function inviteMember(data) {
			return $http.post(config.baseURL + '/api/company/member/invite/', data).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name confirmInviteMember
	 	 * @desc confirm member invitation
	 	 */
		function confirmInviteMember(key) {
			return $http.post(config.baseURL + '/api/company/invite/confirm/' + key).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name inviteFriend
	 	 * @desc invite friend via email
	 	 */
		function inviteFriend(id) {
			var data = {
				target: id
			};
			return $http.post(config.baseURL + '/api/company/friend/invite/', data).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name confirmInviteFriend
	 	 * @desc confirm friend invitation
	 	 */
		function confirmInviteFriend(key) {
			return $http.post(config.baseURL + '/api/company/friend/confirm/' + key).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name createCompanyMember
	 	 * @desc create company member
	 	 */
		function createCompanyMember() {
			var request = {				
			};

			return $http.post(config.baseURL + '/api/company/member/', request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name updateCompanyMember
	 	 * @desc update company member
	 	 */
		function updateCompanyMember() {
			var request = {
				
			};

			return $http.put(config.baseURL + '/api/company/member/', request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name getCompanyList
	 	 * @desc get company list
	 	 */
		function deleteCompanyMember() {
			var request = {				
			};

			return $http.delete(config.baseURL + '/api/company/member/', request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name getAffiliCompanies
	 	 * @desc get affiliated company list
	 	 */
		function getAffiliCompanies() {
			return $http.get(config.baseURL + '/api/company/affiliated/list/').then(function(response) {
				return response.data;
			});		
		}
		
	 	return service;
	}
})();