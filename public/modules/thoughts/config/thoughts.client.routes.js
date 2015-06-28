'use strict';

//Setting up route
angular.module('thoughts').config(['$stateProvider',
	function($stateProvider) {
		// Thoughts state routing
		$stateProvider.
		state('listThoughts', {
			url: '/thoughts',
			templateUrl: 'modules/thoughts/views/list-thoughts.client.view.html'
		}).
		state('createThought', {
			url: '/thoughts/create',
			templateUrl: 'modules/thoughts/views/create-thought.client.view.html'
		}).
		state('viewThought', {
			url: '/thoughts/:thoughtId',
			templateUrl: 'modules/thoughts/views/view-thought.client.view.html'
		}).
		state('editThought', {
			url: '/thoughts/:thoughtId/edit',
			templateUrl: 'modules/thoughts/views/edit-thought.client.view.html'
		});
	}
]);