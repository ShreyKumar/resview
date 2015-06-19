'use strict';

angular.module('core').controller('ViewBoardController', ['$scope', 'Authentication', '$rootScope',
	function($scope, Authentication, $rootScope) {
        $scope.authentication = Authentication;
        console.log($scope.authentication);
        
        //set initial auth message
        $scope.authmsg = "<h3>Please give us authorization to use your friends list. We never post anything without your permission</h3>";
        $rootScope.$apply();
        
        //facebook friends fetching
        // Load the SDK Asynchronously
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                    js = d.createElement(s); js.id = id;
                    js.src = '//connect.facebook.net/en_US/sdk.js';
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));

            //connect to facebook
            //
            window.fbAsyncInit = function() {
                //initializes sdk 
                FB.init({
                    appId      : 483004465185679, // App ID
                    status     : true,    // check login status
                    cookie     : true,    // enable cookies to allow the
                    // server to access the session
                    xfbml      : true,     // parse page for xfbml or html5
                    // social plugins like login button below
                    version    : 'v2.0',  // Specify an API version
                });
                
                FB.login(function(){
                    console.log('Permission has been granted');
                    FB.api('/me/taggable_friends/', function(response){
                        console.log(response);
                        $scope.friends = response.data;
                        $rootScope.$apply();
                    });
                    
                //define certain scopes that needs to be handeled 
                }, {scope: 'user_friends'});
                
	       }
    }]);