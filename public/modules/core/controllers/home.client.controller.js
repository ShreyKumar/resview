'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        console.log($scope.authentication);
        
        //redirect to dashboard if already signed in
        var isAuth = $scope.authentication.user != "";
        if(isAuth) window.location.href = '/#!/viewboard';
        
        //MUTE HTML5 video by default
        $("video").prop('muted', true);
	}
]);