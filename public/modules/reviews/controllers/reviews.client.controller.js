'use strict';

// Reviews controller
angular.module('reviews').controller('ReviewsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reviews',
	function($scope, $stateParams, $location, Authentication, Reviews) {
		$scope.authentication = Authentication;
        $scope.residence = "Chestnut Residence";

        /*
		// Create new Review
		$scope.create = function() {
			// Create new Review object
			var review = new Reviews ({
				name: this.name,
                comments: this.comments,
                foodquality: this.foodquality,
                convinience: this.convinience,
                overallexp: this.overallexp
			});

			// Redirect after save
			review.$save(function(response) {
				$location.path('reviews/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
        */

		// Remove existing Review
		$scope.remove = function(review) {
			if ( review ) { 
				review.$remove();

				for (var i in $scope.reviews) {
					if ($scope.reviews [i] === review) {
						$scope.reviews.splice(i, 1);
					}
				}
			} else {
				$scope.review.$remove(function() {
					$location.path('reviews');
				});
			}
		};

		// Update existing Review
		$scope.update = function() {
			var review = $scope.review;

			review.$update(function() {
				$location.path('reviews/' + review._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reviews
		$scope.find = function() {
			$scope.reviews = Reviews.query();
		};

		// Find existing Review
		$scope.findOne = function() {
			$scope.review = Reviews.get({ 
				reviewId: $stateParams.reviewId
			});
		};
        
        
        //jQuery Magic
        $(document).ready(function(){
            var isClicked = false;
            var isClickedBack = false;
            
            $('div.col-md-3 > div.controls > div.glyphicon').click(function(){
                var currElement = $(this).next();
                while(currElement.hasClass('glyphicon-star')){
                    currElement.removeClass('glyphicon-star');
                    currElement.addClass('glyphicon-star-empty');
                    currElement.removeClass('isClicked');
                    currElement = currElement.next();
                    
                    isClickedBack = true;
                }
                
                //add the first one
                $(this).removeClass('glyphicon-star-empty');
                $(this).addClass('glyphicon-star');
                $(this).addClass('isClicked');
                
                //take the rest out
                $(this).prevAll().removeClass('glyphicon-star-empty');
                $(this).prevAll().addClass('glyphicon-star');
                $(this).prevAll().addClass('isClicked');
                
                //turn on isClicked
                isClicked = true;
                
            });
            
            $('div.col-md-3 > div.controls > div.glyphicon').mouseenter(function(){
                //add the first one
                $(this).removeClass('glyphicon-star-empty');
                $(this).addClass('glyphicon-star');
                
                //take the rest out
                $(this).prevAll().removeClass('glyphicon-star-empty');
                $(this).prevAll().addClass('glyphicon-star');
                
                isClicked = false;
            });
            
            $('div.col-md-3 > div.controls > div.glyphicon').mouseleave(function(){
                if(!isClicked){
                    if(!$(this).hasClass('isClicked')){
                        //add the first one
                        $(this).addClass('glyphicon-star-empty');
                        $(this).removeClass('glyphicon-star');
                    }

                    $(this).prevAll(':not(div.isClicked)').addClass('glyphicon-star-empty');
                    $(this).prevAll(':not(div.isClicked)').removeClass('glyphicon-star');
                }
            });
            
            $("#view").addClass('active');
            $("#write").removeClass('active');
            $("#writereview").hide();
            
            $("#write").unbind().click(function(){
                //change navs
                $("#view").removeClass('active');
                $("#write").addClass('active');
                
                $("#writereview").show();
                $("#seereviews").hide();
            });
            
            $("#view").unbind().click(function(){
                //change navs
                $("#view").addClass('active');
                $("#write").removeClass('active');
                
                $("#writereview").hide();
                $("#seereviews").show();
                
            });
            
            //Form validation
            $("input#submit").click(function(){
                if(!$('div#exp').hasClass('isClicked')){
                    $('div#exp').wrapAll('<div class="error" />');
                    $('div#errormsg').html('<h3>Overall Experience is required.</h3>');
                } else {
                    //here comes the animation   
                }
            });
            
        });
        
        function initialize() {
            //load grayscale style
            var styles = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
            
            // Create a new StyledMapType object, passing it the array of styles,
            // as well as the name to be displayed on the map type control.
            var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

            
            var myLatlng = new google.maps.LatLng(43.6542904, -79.3854518);
            var mapOptions = {
                zoom: 16,
                center: myLatlng,
                mapTypeControlOptions: false,
                disableDefaultUI: true,
                scaleControl: true,
                zoomControl: true,
                zoomControlOptions: {
                  style: google.maps.ZoomControlStyle.LARGE 
                }
                /*
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']  
                }
                */
            };
            
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map
            });
            
            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');
        }

        google.maps.event.addDomListener(window, 'load', initialize);
        
        
            /*
        function initialize() {
            var res = new google.maps.LatLng(43.6542904, -79.3854518);
            var mapOptions = {
              center: res,
              zoom: 18
            };
            
            var marker = new google.maps.Marker({
                position: res,
                map: map,
                title: 'Hello World!'
            });
            
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        }
        google.maps.event.addDomListener(window, 'load', initialize);
        */
	}
]);