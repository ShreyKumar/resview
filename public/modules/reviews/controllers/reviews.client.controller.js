'use strict';

// Reviews controller
angular.module('reviews').controller('ReviewsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reviews',
	function($scope, $stateParams, $location, Authentication, Reviews) {
		$scope.authentication = Authentication;
        $scope.residence = "Chestnut Residence";

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
            $('div.col-md-3 > div.controls > div.glyphicon').click(function(){
                //add the first one
                $(this).removeClass('glyphicon-star-empty');
                $(this).addClass('glyphicon-star');
                
                //take the rest out
                $(this).prevAll().removeClass('glyphicon-star-empty');
                $(this).prevAll().addClass('glyphicon-star');
                
                //remove the mouseout
                $('section').off('mouseleave', 'div.col-md-3 > div.controls > div.glyphicon', starLeave);
                
            });
            
            $('div.col-md-3 > div.controls > div.glyphicon').mouseenter(function(){
                //add the first one
                $(this).removeClass('glyphicon-star-empty');
                $(this).addClass('glyphicon-star');
                
                //take the rest out
                $(this).prevAll().removeClass('glyphicon-star-empty');
                $(this).prevAll().addClass('glyphicon-star');
                
            });
            
            $('div.col-md-3 > div.controls > div.glyphicon').mouseleave(function(){
                //add the first one
                $(this).addClass('glyphicon-star-empty');
                $(this).removeClass('glyphicon-star');

                $(this).prevAll().addClass('glyphicon-star-empty');
                $(this).prevAll().removeClass('glyphicon-star');
            });
            
        });
        
	}
]);