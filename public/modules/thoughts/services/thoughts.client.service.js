'use strict';

//Thoughts service used to communicate Thoughts REST endpoints
angular.module('thoughts').factory('Thoughts', ['$resource',
	function($resource) {
		return $resource('thoughts/:thoughtId', { thoughtId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);