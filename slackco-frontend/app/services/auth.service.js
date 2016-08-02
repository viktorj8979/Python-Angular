(function(){
'use strict';

angular
	.module('app')
	.factory('Auth', AuthService);
	
	AuthService.$inject = ['$http', '$rootScope', '$timeout', 'config', 'localStorageService'];

	function AuthService($http, $rootScope, $timeout, config, localStorageService) {
		var service = {};

		service.signin = signin;
		service.signup = signup;
		service.activate = activate;
		service.sendMagic = sendMagic;
		service.signinMagic = signinMagic;
		service.sendResetPwdRequest = sendResetPwdRequest;
		service.setNewPwd = setNewPwd;		
		service.setCredentials = setCredentials;
		service.clearCredentials = clearCredentials;		

		/**
	 	 * @name signin
	 	 * @desc signin with password
	 	 */
		function signin(company_name, email, password) {
			var request = {
				'company_name'	: company_name,
				'email'			: email,
				'password'		: password
			};

			return $http.post(config.baseURL + '/api/auth/login/', request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name signup
	 	 * @desc signup with company name, email, password
	 	 */
		function signup(company_name, email, password) {
			var request = {
				'company_name'	: company_name,
				'email'			: email,
				'password'		: password
			};

			return $http.post(config.baseURL + '/api/auth/register/', request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name activate
	 	 * @desc activate with verify key
	 	 */
		function activate(verify_key) {
			var request = {
				'verify_key'	: verify_key
			};

			return $http.post(config.baseURL + '/api/auth/activate/', request).then(function(response) {
				return response.data;
			});				
		}

		/**
	 	 * @name sendMagic
	 	 * @desc send the magic link
	 	 */
		function sendMagic(company_name, email) {
			var request = {
				'company_name'	: company_name,
				'email'			: email
			};

			return $http.post(config.baseURL + '/api/auth/magic-link/', request).then(function(response) {
				return response.data;
			});	
		}

		/**
	 	 * @name signinMagic
	 	 * @desc sign in with magic link
	 	 */
		function signinMagic(magic_key) {
			var request = {
				'magic_key'	: magic_key
			};

			return $http.post(config.baseURL + '/api/auth/login-by-link/', request).then(function(response) {
				return response.data;
			});	
		}

		/**
	 	 * @name sendResetPwdRequest
	 	 * @desc send reset password request
	 	 */
		function sendResetPwdRequest(company_name, email) {
			var request = {
				'company_name'	: company_name,
				'email'			: email
			};

			return $http.post(config.baseURL + '/api/auth/reset-password/', request).then(function(response) {
				return response.data;
			});
		}

		function setNewPwd(reset_key, password) {
			var request = {
				'reset_key'	: reset_key,
				'password'	: password
			};

			return $http.post(config.baseURL + '/api/auth/new-password/', request).then(function(response) {
				return response.data;
			});
		}

		/**
	 	 * @name setCredentials
	 	 * @desc 
	 	 */
	 	function setCredentials(company, profile, token) {
	 		$rootScope.globals = {
	 			currentUser: {
	 				company: company,
	 				profile: profile,
	 				token: token
	 			}
	 		};

	 		$http.defaults.headers.common['Authorization'] = 'JWT ' + token; // jshint ignore:line
	 		localStorageService.set('globals', $rootScope.globals);
	 	}

	 	/**
	 	 * @name clearCredentials
	 	 * @desc 
	 	 */
	 	function clearCredentials() {
	 		$rootScope.globals = {};
	 		localStorageService.remove('globals');
	 		$http.defaults.headers.common.Authorization = 'Basic';
	 	}

	 	return service;
	}
})();