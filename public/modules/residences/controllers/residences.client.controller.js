'use strict';

// Residences controller
angular.module('residences').controller('ResidencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Residences',
	function($scope, $stateParams, $location, Authentication, Residences) {
		$scope.authentication = Authentication;

		// Create new Residence
		$scope.create = function() {
			// Create new Residence object
			var residence = new Residences ({
				name: this.name,
                comments: this.comments,
                foodquality: this.foodquality,
                convinience: this.convinience,
                overallexp: this.overallexp
			});

			// Redirect after save
			residence.$save(function(response) {
				$location.path('residences/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Residence
		$scope.remove = function(residence) {
			if ( residence ) { 
				residence.$remove();

				for (var i in $scope.residences) {
					if ($scope.residences [i] === residence) {
						$scope.residences.splice(i, 1);
					}
				}
			} else {
				$scope.residence.$remove(function() {
					$location.path('residences');
				});
			}
		};

		// Update existing Residence
		$scope.update = function() {
			var residence = $scope.residence;

			residence.$update(function() {
				$location.path('residences/' + residence._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Residences
		$scope.find = function() {
			$scope.residences = Residences.query();
		};

		// Find existing Residence
		$scope.findOne = function() {
			$scope.residence = Residences.get({ 
				residenceId: $stateParams.residenceId
			});
		};
	}
]);