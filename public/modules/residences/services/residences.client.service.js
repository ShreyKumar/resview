'use strict';

//Residences service used to communicate Residences REST endpoints
angular.module('residences').factory('Residences', ['$resource',
	function($resource) {
		return $resource('residences/:residenceId', { residenceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);