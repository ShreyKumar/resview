'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        
        //MUTE HTML5 video by default
        $("video").prop('muted', true);
	}
]);