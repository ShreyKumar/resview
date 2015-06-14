'use strict';

//Setting up route
angular.module('residences').config(['$stateProvider',
	function($stateProvider) {
		// Residences state routing
		$stateProvider.
		state('listResidences', {
			url: '/residences',
			templateUrl: 'modules/residences/views/list-residences.client.view.html'
		}).
		state('createResidence', {
			url: '/residences/create',
			templateUrl: 'modules/residences/views/create-residence.client.view.html'
		}).
		state('viewResidence', {
			url: '/residences/:residenceId',
			templateUrl: 'modules/residences/views/view-residence.client.view.html'
		}).
		state('editResidence', {
			url: '/residences/:residenceId/edit',
			templateUrl: 'modules/residences/views/edit-residence.client.view.html'
		});
	}
]);