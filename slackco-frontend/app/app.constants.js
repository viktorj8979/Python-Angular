'use strict';

angular
    .module('app.constants', [])
    .constant('config', {
    	'baseURL': 'http://slackco.herokuapp.com',
    	//'baseURL': 'http://127.0.0.1:8000',
    	'socials': ['facebook', 'twitter', 'instagram', 'google_plus', 'linkedin', 'youtube', 'github', 'stackoverflow']
	});