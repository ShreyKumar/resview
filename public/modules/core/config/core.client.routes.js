'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('credits', {
			url: '/credits',
			templateUrl: 'modules/core/views/credits.client.view.html'
		}).
		state('viewboard', {
			url: '/viewboard',
			templateUrl: 'modules/core/views/viewboard.client.view.html'
		}).
		state('trinity', {
			url: '/trin',
			templateUrl: 'modules/core/views/trinity.client.view.html'
		}).
		state('uc', {
			url: '/uc',
			templateUrl: 'modules/core/views/uc.client.view.html'
		}).
		state('chestnut', {
			url: '/chestnut',
			templateUrl: 'modules/core/views/chestnut.client.view.html'
		}).
		state('new', {
			url: '/new',
			templateUrl: 'modules/core/views/new.client.view.html'
		}).
		state('woodsworth', {
			url: '/woodsworth',
			templateUrl: 'modules/core/views/woodsworth.client.view.html'
		}).
		state('innis', {
			url: '/innis',
			templateUrl: 'modules/core/views/innis.client.view.html'
		}).
		state('victoria', {
			url: '/vic',
			templateUrl: 'modules/core/views/victoria.client.view.html'
		}).
		state('stmikes', {
			url: '/smc',
			templateUrl: 'modules/core/views/stmikes.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);