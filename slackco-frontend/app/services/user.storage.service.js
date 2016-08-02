(function(){
'use strict';

angular
	.module('app')
	.factory('UserStorage', UserStorageService);

	UserStorageService.$inject = [];

	function UserStorageService() {
		var user = {
			company 	: '',
			email 		: '',
			firstName 	: '',
			lastName	: ''
		};

		var service = {};

		service.getUser = getUser;
		service.setUser = setUser;
		service.getCompany = getCompany;
		service.setCompany = setCompany;
		service.getEmail = getEmail;
		service.setEmail = setEmail;
		service.getFirstName = getFirstName;
		service.setFirstName = setFirstName;
		service.getLastName = getLastName;
		service.setLastName = setLastName;

		function getUser() {
			return user;
		}

		function setUser(u) {
			user = {
				company: u.company,
				email: u.email,
				firstName: u.firstName,
				lastName: u.lastName
			};
		}

		function getCompany() {
			return user.company;
		}

		function setCompany(company) {
			user.company = company;
		}

		function getEmail() {
			return user.email;
		}

		function setEmail(email) {
			user.email = email;
		}

		function getFirstName() {
			return user.firstName;
		}

		function setFirstName(firstName) {
			user.firstName = firstName;
		}

		function getLastName() {
			return user.lastName;
		}

		function setLastName(lastName) {
			user.lastName = lastName;
		}

		return service;
	}
})();